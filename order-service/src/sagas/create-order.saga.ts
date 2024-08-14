import { restate, Saga } from 'deepkit-restate';
import { cast, UUID } from '@deepkit/type';
import { Writable } from 'type-fest';

import { ConsumerServiceApi } from '@ftgo/consumer-service-api';
import { AccountingServiceApi } from '@ftgo/accounting-service-api';
import {
  KitchenServiceApi,
  Ticket,
  TicketDetails,
} from '@ftgo/kitchen-service-api';
import {
  CreateOrderSagaApi,
  CreateOrderSagaData,
  OrderServiceApi,
} from '@ftgo/order-service-api';

@restate.saga<CreateOrderSagaApi>()
export class CreateOrderSaga extends Saga<CreateOrderSagaData> {
  readonly definition = this.step()
    .compensate(this.reject)
    .step()
    .invoke(this.validate)
    .step()
    .invoke(this.createTicket)
    .onReply<Ticket>(this.handleTicketCreated)
    .compensate(this.cancelTicket)
    .step()
    .invoke(this.authorize)
    .step()
    .invoke(this.confirmCreateTicket)
    .step()
    .invoke(this.approve)
    .build();

  constructor(
    private readonly consumer: ConsumerServiceApi,
    private readonly order: OrderServiceApi,
    private readonly kitchen: KitchenServiceApi,
    private readonly accounting: AccountingServiceApi,
  ) {
    super();
  }

  reject({ orderId }: CreateOrderSagaData) {
    return this.order.reject(orderId);
  }

  validate({
    orderDetails: { consumerId, orderTotal },
    orderId,
  }: CreateOrderSagaData) {
    return this.consumer.validateOrder(consumerId, orderId, orderTotal);
  }

  createTicket({
    orderDetails: { lineItems, restaurantId },
    orderId,
  }: CreateOrderSagaData) {
    const details = cast<TicketDetails>({ lineItems });
    return this.kitchen.createTicket(restaurantId, orderId, details);
  }

  handleTicketCreated(data: Writable<CreateOrderSagaData>, ticket: Ticket) {
    data.ticketId = ticket.id;
  }

  cancelTicket({ orderId }: CreateOrderSagaData) {
    return this.kitchen.cancelTicket(orderId);
  }

  authorize({
    orderDetails: { consumerId, orderTotal },
    orderId,
  }: CreateOrderSagaData) {
    return this.accounting.authorize(consumerId, orderId, orderTotal);
  }

  confirmCreateTicket({ ticketId }: CreateOrderSagaData) {
    return this.kitchen.confirmCreateTicket(ticketId!);
  }

  approve({ orderId }: CreateOrderSagaData) {
    return this.order.approve(orderId);
  }
}
