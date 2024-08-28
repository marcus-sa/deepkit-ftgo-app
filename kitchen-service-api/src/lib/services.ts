import { RestateService } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import {
  TicketCancelled,
  TicketConfirmed,
  TicketCreated,
  TicketRejected,
} from './replies';
import { TicketDetails } from './types';

export interface KitchenServiceHandlers {
  createTicket(
    restaurantId: UUID,
    orderId: UUID,
    details: TicketDetails,
    confirmAwakeableId: string,
  ): Promise<TicketCreated>;
  confirmTicket(id: UUID, readyAt: Date): Promise<TicketConfirmed>;
  rejectTicket(id: UUID, reason: string): Promise<TicketRejected>;
  cancelTicket(id: UUID, reason: string): Promise<TicketCancelled>;
  beginCancelTicket(restaurantId: UUID, orderId: UUID): Promise<void>;
  undoBeginCancelTicket(restaurantId: UUID, orderId: UUID): Promise<void>;
  confirmCancelTicket(restaurantId: UUID, orderId: UUID): Promise<void>;
}

export type KitchenServiceApi = RestateService<
  'Kitchen',
  KitchenServiceHandlers
>;
