import { restate, RestateServiceContext } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { CreateOrderSagaState } from '@ftgo/order-service-api';
import { RestaurantCreatedEvent } from '@ftgo/restaurant-service-api';
import {
  KitchenServiceApi,
  KitchenServiceHandlers,
  Ticket,
  TicketDetails,
  TicketNotFound,
  TicketConfirmed,
  TicketCreated,
} from '@ftgo/kitchen-service-api';

import { TicketRepository } from './ticket.repository';

@restate.service<KitchenServiceApi>()
export class KitchenService implements KitchenServiceHandlers {
  constructor(
    private readonly ticket: TicketRepository,
    private readonly ctx: RestateServiceContext,
  ) {}

  @(restate.event<RestaurantCreatedEvent>().handler())
  async createMenu({ restaurant }: RestaurantCreatedEvent): Promise<void> {}

  @(restate.event<RestaurantCreatedEvent>().handler())
  async reviseMenu({ restaurant }: RestaurantCreatedEvent): Promise<void> {}

  @restate.handler()
  async beginCancelTicket(restaurantId: UUID, orderId: UUID): Promise<Ticket> {}

  @restate.handler()
  async cancelTicket(id: UUID): Promise<Ticket> {
    const ticket = await this.ticket.find({ id });
    if (!ticket) {
      throw new TicketNotFound(id);
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
  ): Promise<Ticket> {}

  @restate.handler()
  async confirmTicket(id: UUID, readyAt: Date): Promise<Ticket> {
    const ticket = await this.ticket.find({ id });
    if (!ticket) {
      throw new TicketNotFound(id);
    }
    ticket.confirm();
    await this.ticket.persist(ticket);
    await this.ctx.resolveAwakeable<TicketConfirmed>(
      ticket.confirmCreateAwakeableId!,
      new TicketConfirmed(readyAt),
    );
    return ticket;
  }

  @restate.handler()
  async createTicket(
    restaurantId: UUID,
    orderId: UUID,
    details: TicketDetails,
    confirmAwakeableId: string,
  ): Promise<TicketCreated> {
    // TODO: notify kitchen staff that a ticket has been created
    const ticket = await this.ticket.create(
      restaurantId,
      orderId,
      details,
      confirmAwakeableId,
    );
    return new TicketCreated(ticket.id);
  }

  @restate.handler()
  async undoBeginCancelTicket(
    restaurantId: UUID,
    orderId: UUID,
  ): Promise<Ticket> {}
}
