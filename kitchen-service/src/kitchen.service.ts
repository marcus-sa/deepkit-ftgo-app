import {
  restate,
  RestateEventsPublisher,
  RestateServiceContext,
} from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { RestaurantCreatedEvent } from '@ftgo/restaurant-service-api';
import {
  KitchenServiceApi,
  KitchenServiceHandlers,
  TicketCancelled,
  TicketConfirmed,
  TicketCreated,
} from '@ftgo/kitchen-service-api';

import { TicketRepository } from './ticket.repository';
import { TicketDetails } from './entities';

@restate.service<KitchenServiceApi>()
export class KitchenService implements KitchenServiceHandlers {
  constructor(
    private readonly ticket: TicketRepository,
    private readonly ctx: RestateServiceContext,
  ) {}

  // @ts-expect-error invalid number of arguments
  @(restate.event<RestaurantCreatedEvent>().handler())
  async createMenu({ restaurantId }: RestaurantCreatedEvent): Promise<void> {}

  @restate.handler()
  async cancelTicket(id: UUID): Promise<TicketCancelled> {
    return new TicketCancelled(id);
  }

  @restate.handler()
  async beginCancelTicket(restaurantId: UUID, orderId: UUID): Promise<void> {
    throw new Error('Not yet implemented');
  }

  @restate.handler()
  async rejectTicket(id: UUID, reason: string): Promise<void> {
    const ticket = await this.ticket.findById(id);
    ticket.reject(reason);
    await this.ticket.save(ticket);
    await this.ctx.rejectAwakeable(ticket.confirmAwakeableId!, reason);
  }

  @restate.handler()
  async confirmCancelTicket(restaurantId: UUID, orderId: UUID): Promise<void> {
    throw new Error('Not yet implemented');
  }

  @restate.handler()
  async confirmTicket(id: UUID, readyAt: Date): Promise<void> {
    const ticket = await this.ticket.findById(id);
    ticket.confirm();
    await this.ticket.save(ticket);
    await this.ctx.resolveAwakeable<TicketConfirmed>(
      ticket.confirmAwakeableId!,
      new TicketConfirmed(readyAt),
    );
  }

  @restate.handler()
  async createTicket(
    restaurantId: UUID,
    orderId: UUID,
    details: TicketDetails,
    confirmAwakeableId: string,
  ): Promise<TicketCreated> {
    const ticket = await this.ticket.create(
      restaurantId,
      orderId,
      details,
      confirmAwakeableId,
    );
    const ticketCreated = new TicketCreated(ticket.id);
    // TODO: notify kitchen that ticket has been created by triggering novu
    return ticketCreated;
  }

  @restate.handler()
  async undoBeginCancelTicket(
    restaurantId: UUID,
    orderId: UUID,
  ): Promise<void> {
    throw new Error('Not yet implemented');
  }
}
