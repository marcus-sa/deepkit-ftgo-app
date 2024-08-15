import {
  restate,
  RestateAwakeable,
  RestateSagaContext,
  Saga,
} from 'deepkit-restate';
import { cast, UUID } from '@deepkit/type';
import { Writable } from 'type-fest';

import { ConsumerServiceApi } from '@ftgo/consumer-service-api';
import { AccountingServiceApi } from '@ftgo/accounting-service-api';
import {
  KitchenConfirmCreateTicket,
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
  #confirmTicket?: RestateAwakeable<KitchenConfirmCreateTicket>;

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
    .invoke(this.waitForTicketConfirmation)
    .step()
    .invoke(this.approve)
    .build();

  constructor(
    private readonly consumer: ConsumerServiceApi,
    private readonly order: OrderServiceApi,
    private readonly kitchen: KitchenServiceApi,
    private readonly accounting: AccountingServiceApi,
    private readonly ctx: RestateSagaContext,
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

  async createTicket({
    orderDetails: { lineItems, restaurantId },
    orderId,
  }: CreateOrderSagaData) {
    const details = cast<TicketDetails>({ lineItems });
    this.#confirmTicket = this.ctx.awakeable<KitchenConfirmCreateTicket>();
    return this.kitchen.createTicket(
      restaurantId,
      orderId,
      details,
      this.#confirmTicket!.id,
    );
  }

  handleTicketCreated(data: Writable<CreateOrderSagaData>, ticket: Ticket) {
    data.ticketId = ticket.id;
  }

  async cancelTicket({ ticketId }: CreateOrderSagaData) {
    return this.kitchen.cancelTicket(ticketId!);
  }

  authorize({
    orderDetails: { consumerId, orderTotal },
    orderId,
  }: CreateOrderSagaData) {
    return this.accounting.authorize(consumerId, orderId, orderTotal);
  }

  async waitForTicketConfirmation() {
    await this.#confirmTicket!.promise;
  }

  approve({ orderId }: CreateOrderSagaData) {
    return this.order.approve(orderId);
  }
}
