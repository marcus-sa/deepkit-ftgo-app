import { assert, deserialize } from '@deepkit/type';
import { Writable } from 'type-fest';
import {
  restate,
  RestateAwakeable,
  RestateSagaContext,
  Saga,
} from 'deepkit-restate';

import {
  CourierDeliveryAssigned,
  CourierServiceApi,
} from '@ftgo/courier-service-api';
import {
  DeliveryCreated,
  DeliveryServiceApi,
} from '@ftgo/delivery-service-api';
import {
  CustomerOrderValidationFailed,
  CustomerServiceApi,
} from '@ftgo/customer-service-api';
import {
  PaymentAuthorizationFailed,
  PaymentAuthorized,
  PaymentServiceApi,
} from '@ftgo/payment-service-api';
import {
  KitchenServiceApi,
  TicketCancelled,
  TicketConfirmed,
  TicketCreated,
  TicketDetails,
} from '@ftgo/kitchen-service-api';
import {
  CreateOrderSagaApi,
  CreateOrderSagaData,
  CreateOrderSagaRejectedState,
  CreateOrderSagaState,
  OrderApproved,
  OrderRejected,
  OrderServiceApi,
} from '@ftgo/order-service-api';

@restate.saga<CreateOrderSagaApi>()
export class CreateOrderSaga extends Saga<CreateOrderSagaData> {
  confirmTicketAwakeable?: RestateAwakeable<TicketConfirmed>;
  assignCourierToDeliveryAwakeable?: RestateAwakeable<CourierDeliveryAssigned>;

  readonly definition = this.step()
    .invoke(this.create)
    .compensate(this.reject)
    .onReply<OrderRejected>(this.handleRejected)
    .step()
    .invoke(this.validate)
    .onReply<CustomerOrderValidationFailed>(
      this.handleCustomerOrderValidationFailed,
    )
    .step()
    .invoke(this.authorizePayment)
    .onReply<PaymentAuthorized>(this.handlePaymentAuthorized)
    .onReply<PaymentAuthorizationFailed>(this.handlePaymentAuthorizationFailed)
    .compensate(this.reversePaymentAuthorization)
    .step()
    .invoke(this.createTicket)
    .onReply<TicketCreated>(this.handleTicketCreated)
    .step()
    .invoke(this.waitForTicketConfirmation)
    .step()
    .compensate(this.cancelTicket)
    .onReply<TicketCancelled>(this.handleTicketCancelled)
    // .onReply<TicketCancellationFailed>(this.handleTicketCancellationFailed)
    .step()
    .invoke(this.createDelivery)
    .onReply<DeliveryCreated>(this.handleDeliveryCreated)
    .compensate(this.cancelDelivery)
    // TODO: courier service
    .step()
    // .invoke(this.findAvailableCourierAndAssignToDelivery)
    // .onReply(this.handleCourierAssigned)
    // .step()
    // .invoke(this.waitForCourierAssignment)
    // .step()
    .invoke(this.approve)
    .onReply<OrderApproved>(this.handleApproved)
    .build();

  constructor(
    private readonly customer: CustomerServiceApi,
    private readonly order: OrderServiceApi,
    private readonly kitchen: KitchenServiceApi,
    private readonly delivery: DeliveryServiceApi,
    private readonly payment: PaymentServiceApi,
    private readonly courier: CourierServiceApi,
    private readonly ctx: RestateSagaContext,
  ) {
    super();
  }

  create({ orderId, orderDetails }: CreateOrderSagaData) {
    return this.order.create(orderId, orderDetails);
  }

  reject({ orderId }: CreateOrderSagaData) {
    return this.order.reject(orderId);
  }

  handleRejected(data: Writable<CreateOrderSagaData>) {
    assert<CreateOrderSagaRejectedState>(data.state);
    data.rejectedState = data.state;
    data.state = CreateOrderSagaState.REJECTED;
  }

  validate({
    orderDetails: { customerId, orderTotal },
    orderId,
  }: CreateOrderSagaData) {
    // validate that customer can authorize the money
    return this.customer.validateOrder(customerId, orderId, orderTotal);
  }

  handleCustomerOrderValidationFailed(data: Writable<CreateOrderSagaData>) {
    data.state = CreateOrderSagaState.CUSTOMER_VALIDATION_FAILED;
  }

  authorizePayment({
    orderDetails: { customerId, orderTotal },
    orderId,
  }: CreateOrderSagaData) {
    return this.payment.authorize(customerId, orderId, orderTotal);
  }

  handlePaymentAuthorized(
    data: Writable<CreateOrderSagaData>,
    { paymentId }: PaymentAuthorized,
  ) {
    data.paymentId = paymentId;
    data.state = CreateOrderSagaState.PAYMENT_AUTHORIZED;
  }

  handlePaymentAuthorizationFailed(
    data: Writable<CreateOrderSagaData>,
    { paymentId }: PaymentAuthorizationFailed,
  ) {
    data.paymentId = paymentId;
    data.state = CreateOrderSagaState.PAYMENT_AUTHORIZATION_FAILED;
  }

  reversePaymentAuthorization({ paymentId }: CreateOrderSagaData) {
    if (!paymentId) {
      throw new Error('Missing payment id');
    }
    return this.payment.reverseAuthorization(paymentId);
  }

  createTicket({
    orderDetails: { lineItems, restaurantId },
    orderId,
  }: CreateOrderSagaData) {
    const details = deserialize<TicketDetails>({ lineItems });
    this.confirmTicketAwakeable = this.ctx.awakeable<TicketConfirmed>();
    return this.kitchen.createTicket(
      restaurantId,
      orderId,
      details,
      this.confirmTicketAwakeable!.id,
    );
  }

  handleTicketCreated(
    data: Writable<CreateOrderSagaData>,
    { ticketId }: TicketCreated,
  ) {
    data.state = CreateOrderSagaState.WAITING_FOR_TICKET_CONFIRMATION;
    data.ticketId = ticketId;
  }

  async waitForTicketConfirmation(data: Writable<CreateOrderSagaData>) {
    try {
      await this.confirmTicketAwakeable!.promise;
      data.state = CreateOrderSagaState.TICKET_CONFIRMED;
    } catch (err) {
      data.state = CreateOrderSagaState.TICKET_REJECTED;
      throw err;
    }
  }

  cancelTicket({ ticketId, state }: CreateOrderSagaData) {
    if (!ticketId) {
      throw new Error('Missing ticket id');
    }
    return this.kitchen.cancelTicket(
      ticketId,
      'Create order saga is compensating',
    );
  }

  handleTicketCancelled(data: Writable<CreateOrderSagaData>) {
    data.state = CreateOrderSagaState.TICKET_CANCELLED;
  }

  createDelivery({
    orderId,
    ticketId,
    orderDetails: { restaurantId, customerId, deliveryInformation },
  }: CreateOrderSagaData) {
    this.assignCourierToDeliveryAwakeable =
      this.ctx.awakeable<CourierDeliveryAssigned>();

    return this.delivery.create(
      orderId,
      customerId,
      restaurantId,
      deliveryInformation,
      this.assignCourierToDeliveryAwakeable.id,
    );
  }

  handleDeliveryCreated(
    data: Writable<CreateOrderSagaData>,
    { deliveryId }: DeliveryCreated,
  ) {
    // data.state = CreateOrderSagaState.DELIVERY_CREATED;
    data.state = CreateOrderSagaState.WAITING_FOR_COURIER_ASSIGNMENT;
    data.deliveryId = deliveryId;
  }

  cancelDelivery() {
    throw new Error('Not implemented yet');
  }

  // findAvailableCourierAndAssignToDelivery({ deliveryId }: CreateOrderSagaData) {
  //   return this.courier.findAvailableCourierAndAssignToDelivery(
  //     deliveryId!,
  //     this.assignCourierToDeliveryAwakeable!.id,
  //   );
  // }

  // handleCourierAssigned(
  //   data: Writable<CreateOrderSagaData>,
  //   { courierId }: CourierDeliveryAssigned,
  // ) {
  //   // TODO: add courier id to delivery
  //   data.state = CreateOrderSagaState.WAITING_FOR_COURIER_ASSIGNMENT;
  // }

  // async waitForCourierAssignment(data: Writable<CreateOrderSagaData>) {
  //   try {
  //     await this.assignCourierToDeliveryAwakeable!.promise;
  //     // data.state = CreateOrderSagaState.COURIER_DELIVERY_ASSIGNMENT_COMPLETE;;
  //   } catch (err) {
  //     // data.state = CreateOrderSagaState.COURIER_DELIVERY_ASSIGNMENT_FAILED;
  //     throw err;
  //   }
  // }

  approve({ orderId }: CreateOrderSagaData) {
    return this.order.approve(orderId);
  }

  handleApproved(data: Writable<CreateOrderSagaData>) {
    data.state = CreateOrderSagaState.APPROVED;
  }
}
