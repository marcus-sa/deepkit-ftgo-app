import {
  restate,
  RestateAwakeable,
  RestateSagaContext,
  Saga,
} from 'deepkit-restate';
import { cast } from '@deepkit/type';
import { Writable } from 'type-fest';

import { CustomerServiceApi } from '@ftgo/customer-service-api';
import {
  PaymentAuthorized,
  PaymentServiceApi,
} from '@ftgo/payment-service-api';
import {
  KitchenServiceApi,
  TicketConfirmed,
  TicketCreated,
  TicketDetails,
} from '@ftgo/kitchen-service-api';
import {
  CreateOrderSagaApi,
  CreateOrderSagaData,
  CreateOrderSagaState,
  OrderApproved,
  OrderRejected,
  OrderServiceApi,
} from '@ftgo/order-service-api';

@restate.saga<CreateOrderSagaApi>()
export class CreateOrderSaga extends Saga<CreateOrderSagaData> {
  confirmTicketAwakeable?: RestateAwakeable<TicketConfirmed>;

  readonly definition = this.step()
    .invoke(this.create)
    .compensate(this.reject)
    .onReply<OrderRejected>(this.handleRejected)
    .step()
    .invoke(this.validate)
    .step()
    .invoke(this.authorizePayment)
    .onReply<PaymentAuthorized>(this.handlePaymentAuthorized)
    .compensate(this.reversePaymentAuthorization)
    .step()
    .invoke(this.createTicket)
    .onReply<TicketCreated>(this.handleTicketCreated)
    // TODO: should this be done when the kitchen rejects the ticket?
    .compensate(this.cancelTicket)
    .step()
    .invoke(this.waitForTicketConfirmation)
    .step()
    .invoke(this.approve)
    .onReply<OrderApproved>(this.handleApproved)
    .build();

  constructor(
    private readonly customer: CustomerServiceApi,
    private readonly order: OrderServiceApi,
    private readonly kitchen: KitchenServiceApi,
    private readonly payment: PaymentServiceApi,
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
    data.state = CreateOrderSagaState.REJECTED;
  }

  validate({
    orderDetails: { customerId, orderTotal },
    orderId,
  }: CreateOrderSagaData) {
    // validate that customer can authorize the money
    return this.customer.validateOrder(customerId, orderId, orderTotal);
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
    const details = cast<TicketDetails>({ lineItems });
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
    data.state = CreateOrderSagaState.WAITING_FOR_CONFIRMATION;
    data.ticketId = ticketId;
  }

  cancelTicket({ ticketId }: CreateOrderSagaData) {
    if (!ticketId) {
      throw new Error('Missing ticket id');
    }
    return this.kitchen.rejectTicket(ticketId, 'Unknown');
  }

  async waitForTicketConfirmation(data: Writable<CreateOrderSagaData>) {
    await this.confirmTicketAwakeable!.promise;
    data.state = CreateOrderSagaState.CONFIRMED;
  }

  approve({ orderId }: CreateOrderSagaData) {
    return this.order.approve(orderId);
  }

  handleApproved(data: Writable<CreateOrderSagaData>) {
    data.state = CreateOrderSagaState.APPROVED;
  }
}
