import {
  restate,
  RestateAwakeable,
  RestateSagaContext,
  Saga,
} from 'deepkit-restate';
import { cast } from '@deepkit/type';
import { Writable } from 'type-fest';

import { CustomerServiceApi } from '@ftgo/customer-service-api';
import { PaymentReserved, PaymentServiceApi } from '@ftgo/payment-service-api';
import {
  KitchenServiceApi,
  Ticket,
  TicketConfirmed,
  TicketCreated,
  TicketDetails,
} from '@ftgo/kitchen-service-api';
import {
  CreateOrderSagaApi,
  CreateOrderSagaData,
  CreateOrderSagaState,
  OrderServiceApi,
} from '@ftgo/order-service-api';

@restate.saga<CreateOrderSagaApi>()
export class CreateOrderSaga extends Saga<CreateOrderSagaData> {
  #confirmTicketAwakeable?: RestateAwakeable<TicketConfirmed>;

  readonly definition = this.step()
    .compensate(this.reject)
    .step()
    .invoke(this.validate)
    .step()
    .invoke(this.reservePayment)
    .onReply<PaymentReserved>(this.handlePaymentReserved)
    .compensate(this.reversePayment)
    .step()
    .invoke(this.createTicket)
    .onReply<TicketCreated>(this.handleTicketCreated)
    .compensate(this.cancelTicket)
    .step()
    .invoke(this.authorize)
    .step()
    .invoke(this.waitForTicketConfirmation)
    .step()
    .invoke(this.approve)
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

  reject({ orderId }: CreateOrderSagaData) {
    return this.order.reject(orderId);
  }

  validate({
    orderDetails: { customerId, orderTotal },
    orderId,
  }: CreateOrderSagaData) {
    // validate that customer can reserve the money
    return this.customer.validateOrder(customerId, orderId, orderTotal);
  }

  reservePayment({
    orderDetails: { customerId, orderTotal },
    orderId,
  }: CreateOrderSagaData) {
    return this.payment.reserve(customerId, orderId, orderTotal);
  }

  handlePaymentReserved(
    data: Writable<CreateOrderSagaData>,
    { paymentId }: PaymentReserved,
  ) {
    data.paymentId = paymentId;
    data.state = CreateOrderSagaState.PAYMENT_RESERVED;
  }

  reversePayment({ paymentId }: CreateOrderSagaData) {
    if (!paymentId) {
      throw new Error('Missing payment id');
    }
    return this.payment.reverse(paymentId);
  }

  async createTicket({
    orderDetails: { lineItems, restaurantId },
    orderId,
  }: CreateOrderSagaData) {
    const details = cast<TicketDetails>({ lineItems });
    this.#confirmTicketAwakeable = this.ctx.awakeable<TicketConfirmed>();
    return this.kitchen.createTicket(
      restaurantId,
      orderId,
      details,
      this.#confirmTicketAwakeable!.id,
    );
  }

  handleTicketCreated(
    data: Writable<CreateOrderSagaData>,
    { ticketId }: TicketCreated,
  ) {
    data.ticketId = ticketId;
  }

  cancelTicket({ ticketId }: CreateOrderSagaData) {
    if (!ticketId) {
      throw new Error('Missing ticket id');
    }
    return this.kitchen.cancelTicket(ticketId);
  }

  // TODO: should payment be processed upon ticket confirmation or after delivery?
  authorize({
    orderDetails: { customerId, orderTotal },
    orderId,
  }: CreateOrderSagaData) {
    return this.payment.authorize(customerId, orderId, orderTotal);
  }

  async waitForTicketConfirmation() {
    await this.#confirmTicketAwakeable!.promise;
  }

  approve({ orderId }: CreateOrderSagaData) {
    return this.order.approve(orderId);
  }
}
