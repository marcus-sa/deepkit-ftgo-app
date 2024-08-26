import { RestateService } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { TicketCreated, TicketNotFound } from './replies';
import { TicketDetails } from './types';

export interface KitchenServiceHandlers {
  createTicket(
    restaurantId: UUID,
    orderId: UUID,
    details: TicketDetails,
    confirmAwakeableId: string,
  ): Promise<TicketCreated>;
  confirmTicket(id: UUID, readyAt: Date): Promise<void>;
  rejectTicket(id: UUID, reason: string): Promise<void>;
  beginCancelTicket(restaurantId: UUID, orderId: UUID): Promise<void>;
  undoBeginCancelTicket(restaurantId: UUID, orderId: UUID): Promise<void>;
  confirmCancelTicket(restaurantId: UUID, orderId: UUID): Promise<void>;
}

export type KitchenServiceApi = RestateService<
  'Kitchen',
  KitchenServiceHandlers,
  [TicketNotFound]
>;
