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
  TicketRejected,
} from '@ftgo/kitchen-service-api';

import { TicketRepository } from './ticket.repository';
import { KitchenRpcEventsBus } from './rpc-events';
import { TicketDetails } from './entities';

@restate.service<KitchenServiceApi>()
export class KitchenService implements KitchenServiceHandlers {
  constructor(
    private readonly ticket: TicketRepository,
    private readonly rpcEvents: KitchenRpcEventsBus,
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
  async rejectTicket(id: UUID, reason: string): Promise<TicketRejected> {
    const ticket = await this.ticket.findById(id);

    const ticketRejected = ticket.reject(reason);
    await this.ticket.save(ticket);

    await this.ctx.rejectAwakeable(ticket.confirmAwakeableId!, reason);
    await this.rpcEvents.publish(ticketRejected);

    return ticketRejected;
  }

  @restate.handler()
  async confirmCancelTicket(restaurantId: UUID, orderId: UUID): Promise<void> {
    throw new Error('Not yet implemented');
  }

  @restate.handler()
  async confirmTicket(id: UUID, readyAt: Date): Promise<TicketConfirmed> {
    const ticket = await this.ticket.findById(id);

    const ticketConfirmed = ticket.confirm(readyAt);
    await this.ticket.save(ticket);

    await this.ctx.resolveAwakeable<TicketConfirmed>(
      ticket.confirmAwakeableId!,
      ticketConfirmed,
    );
    await this.rpcEvents.publish(ticketConfirmed);

    return ticketConfirmed;
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
    await this.rpcEvents.publish(ticketCreated);
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
