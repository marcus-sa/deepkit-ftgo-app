import { ReactiveEventsBus } from '@ftgo/common';
import {
  TicketConfirmed,
  TicketCreated,
  TicketRejected,
} from '@ftgo/kitchen-service-api';

export type KitchenRpcEvents = TicketCreated | TicketConfirmed | TicketRejected;

export type KitchenRpcEventsBus = ReactiveEventsBus<KitchenRpcEvents>;
