import { restate, RestateServiceContext } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import {
  Restaurant,
  RestaurantCreatedEvent,
  RestaurantMenu,
} from '@ftgo/restaurant-service-api';
import {
  KitchenServiceApi,
  KitchenServiceHandlers,
  Ticket,
  TicketDetails,
} from '@ftgo/kitchen-service-api';

@restate.service<KitchenServiceApi>()
export class KitchenService implements KitchenServiceHandlers {
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
  async cancelTicket(orderId: UUID): Promise<Ticket> {
    return Promise.resolve(undefined);
  }

  @restate.handler()
  async confirmCancelTicket(
    restaurantId: UUID,
    orderId: UUID,
  ): Promise<Ticket> {
    return Promise.resolve(undefined);
  }

  @restate.handler()
  async confirmCreateTicket(ticketId: UUID): Promise<Ticket> {
    return Promise.resolve(undefined);
  }

  @restate.handler()
  async createTicket(
    restaurantId: UUID,
    orderId: UUID,
    details: TicketDetails,
  ): Promise<Ticket> {
    return Promise.resolve(undefined);
  }

  @restate.handler()
  async undoBeginCancelTicket(
    restaurantId: UUID,
    orderId: UUID,
  ): Promise<Ticket> {
    return Promise.resolve(undefined);
  }
}
