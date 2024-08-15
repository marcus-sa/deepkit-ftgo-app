import { restate, RestateServiceContext } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { RestaurantCreatedEvent } from '@ftgo/restaurant-service-api';
import {
  KitchenServiceApi,
  KitchenServiceHandlers,
  Ticket,
  TicketDetails,
  KitchenTicketNotFound,
  KitchenConfirmCreateTicket,
} from '@ftgo/kitchen-service-api';

import { TicketRepository } from './ticket.repository';
import { CreateOrderSagaState } from '@ftgo/order-service-api';

@restate.service<KitchenServiceApi>()
export class KitchenService implements KitchenServiceHandlers {
  constructor(
    private readonly ticket: TicketRepository,
    private readonly ctx: RestateServiceContext,
  ) {}

  // @ts-ignore
  @(restate.event<RestaurantCreatedEvent>().handler())
  async createMenu({ restaurant }: RestaurantCreatedEvent): Promise<void> {}

  // @ts-ignore
  @(restate.event<RestaurantCreatedEvent>().handler())
  async reviseMenu({ restaurant }: RestaurantCreatedEvent): Promise<void> {}

  @restate.handler()
  async beginCancelTicket(restaurantId: UUID, orderId: UUID): Promise<Ticket> {
    return Promise.resolve(undefined);
  }

  @restate.handler()
  async cancelTicket(id: UUID): Promise<Ticket> {
    const ticket = await this.ticket.find({ id });
    if (!ticket) {
      throw new KitchenTicketNotFound();
    }
    ticket.cancel();
    await this.ticket.persist(ticket);
    await this.ctx.rejectAwakeable(
      ticket.confirmCreateAwakeableId!,
      CreateOrderSagaState.CANCELLED,
    );
    return ticket;
  }

  @restate.handler()
  async confirmCancelTicket(
    restaurantId: UUID,
    orderId: UUID,
  ): Promise<Ticket> {
    return Promise.resolve(undefined);
  }

  @restate.handler()
  async confirmCreateTicket(id: UUID, readyAt: Date): Promise<Ticket> {
    const ticket = await this.ticket.find({ id });
    if (!ticket) {
      throw new KitchenTicketNotFound();
    }
    ticket.confirm();
    await this.ticket.persist(ticket);
    await this.ctx.resolveAwakeable<KitchenConfirmCreateTicket>(
      ticket.confirmCreateAwakeableId!,
      new KitchenConfirmCreateTicket(readyAt),
    );
    return ticket;
  }

  @restate.handler()
  async createTicket(
    restaurantId: UUID,
    orderId: UUID,
    details: TicketDetails,
    confirmAwakeableId: string,
  ): Promise<Ticket> {
    // TODO: notify kitchen staff that a ticket has been created
    return await this.ticket.create(
      restaurantId,
      orderId,
      details,
      confirmAwakeableId,
    );
  }

  @restate.handler()
  async undoBeginCancelTicket(
    restaurantId: UUID,
    orderId: UUID,
  ): Promise<Ticket> {
    return Promise.resolve(undefined);
  }
}
