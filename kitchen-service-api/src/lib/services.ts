import { RestateService } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import {
  Restaurant,
  RestaurantCreatedEvent,
  RestaurantMenu,
} from '@ftgo/restaurant-service-api';

import { Ticket, TicketDetails } from './entities';

export interface KitchenServiceHandlers {
  createTicket(
    restaurantId: UUID,
    orderId: UUID,
    details: TicketDetails,
    confirmAwakeableId: string,
  ): Promise<Ticket>;
  confirmCreateTicket(id: UUID, readyAt: Date): Promise<Ticket>;
  cancelTicket(id: UUID): Promise<Ticket>;
  beginCancelTicket(restaurantId: UUID, orderId: UUID): Promise<Ticket>;
  undoBeginCancelTicket(restaurantId: UUID, orderId: UUID): Promise<Ticket>;
  confirmCancelTicket(restaurantId: UUID, orderId: UUID): Promise<Ticket>;
  createMenu(event: RestaurantCreatedEvent): Promise<void>;
  reviseMenu(event: RestaurantCreatedEvent): Promise<void>;
}

export type KitchenServiceApi = RestateService<
  'Kitchen',
  KitchenServiceHandlers
>;
