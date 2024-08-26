import { restate, RestateServiceContext } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { RestaurantCreatedEvent } from '@ftgo/restaurant-service-api';
import {
  KitchenServiceApi,
  KitchenServiceHandlers,
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
  async beginCancelTicket(restaurantId: UUID, orderId: UUID): Promise<void> {
    throw new Error('Not yet implemented');
  }

  @restate.handler()
  async rejectTicket(id: UUID, reason: string): Promise<void> {
    const ticket = await this.ticket.findById(id);
    ticket.reject(reason);
    await this.ticket.save(ticket);
    await this.ctx.rejectAwakeable(ticket.confirmCreateAwakeableId!, reason);
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
      ticket.confirmCreateAwakeableId!,
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
  ): Promise<void> {
    throw new Error('Not yet implemented');
  }
}
