import { rpc } from '@deepkit/rpc';
import { Observable } from 'rxjs';
import { UUID } from '@deepkit/type';
import { RestateClient } from 'deepkit-restate';

import {
  KitchenRpcController,
  KitchenServiceApi,
  TicketConfirmed,
  TicketCreated,
  TicketRejected,
} from '@ftgo/kitchen-service-api';

import { KitchenRpcEventsBus } from './rpc-events';

@rpc.controller('kitchen')
export class KitchenController implements KitchenRpcController {
  constructor(
    private readonly rpcEvents: KitchenRpcEventsBus,
    private readonly kitchen: KitchenServiceApi,
    private readonly client: RestateClient,
  ) {}

  @rpc.action()
  async createdTickets(): Promise<Observable<TicketCreated>> {
    return await this.rpcEvents.subscribe<TicketCreated>();
  }

  @rpc.action()
  async confirmedTickets(): Promise<Observable<TicketConfirmed>> {
    return await this.rpcEvents.subscribe<TicketConfirmed>();
  }

  @rpc.action()
  async rejectedTickets(): Promise<Observable<TicketRejected>> {
    return await this.rpcEvents.subscribe<TicketRejected>();
  }

  @rpc.action()
  async confirmTicket(id: UUID, readyAt: Date): Promise<TicketConfirmed> {
    return await this.client.rpc(this.kitchen.confirmTicket(id, readyAt));
  }

  @rpc.action()
  async rejectTicket(id: UUID, reason: string): Promise<TicketRejected> {
    return await this.client.rpc(this.kitchen.rejectTicket(id, reason));
  }
}
