import { Observable } from 'rxjs';
import { UUID } from '@deepkit/type';

import { TicketConfirmed, TicketCreated, TicketRejected } from './replies';

export interface KitchenRpcController {
  createdTickets(): Promise<Observable<TicketCreated>>;
  rejectedTickets(): Promise<Observable<TicketRejected>>;
  confirmedTickets(): Promise<Observable<TicketConfirmed>>;
  confirmTicket(id: UUID, readyAt: Date): Promise<TicketConfirmed>;
  rejectTicket(id: UUID, reason: string): Promise<TicketRejected>;
}
