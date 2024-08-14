import { RestateService } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { Restaurant, RestaurantMenu } from '@ftgo/restaurant-service-api';

import { Ticket, TicketDetails } from './entities';

export interface KitchenServiceHandlers {
  createTicket(
    restaurantId: UUID,
    orderId: UUID,
    details: TicketDetails,
  ): Promise<Ticket>;
  confirmCreateTicket(ticketId: UUID): Promise<Ticket>;
  cancelTicket(orderId: UUID): Promise<Ticket>;
  beginCancelTicket(restaurantId: UUID, orderId: UUID): Promise<Ticket>;
  undoBeginCancelTicket(restaurantId: UUID, orderId: UUID): Promise<Ticket>;
  confirmCancelTicket(restaurantId: UUID, orderId: UUID): Promise<Ticket>;
  reviseMenu(menu: RestaurantMenu): Promise<void>;
  createMenu(restaurant: Restaurant): Promise<void>;
}

export type KitchenServiceApi = RestateService<
  'Kitchen',
  KitchenServiceHandlers
>;
