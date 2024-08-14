import { restate, RestateServiceContext } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { Restaurant, RestaurantMenu } from '@ftgo/restaurant-service-api';
import {
  KitchenServiceApi,
  KitchenServiceHandlers,
  Ticket,
  TicketDetails,
} from '@ftgo/kitchen-service-api';

@restate.service<KitchenServiceApi>()
export class KitchenService implements KitchenServiceHandlers {
  @restate.handler()
  async createMenu(restaurant: Restaurant): Promise<void> {}

  @restate.handler()
  async reviseMenu(menu: RestaurantMenu): Promise<void> {}

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
