import { RestateRepository } from '@ftgo/common';
import { TicketNotFound } from '@ftgo/kitchen-service-api';

import { Ticket } from './entities';

export class TicketRepository extends RestateRepository<Ticket> {
  /**
   * @throws TicketNotFound
   */
  async findById(id: Ticket['id']): Promise<Ticket> {
    const ticket = await this.find({ id });
    if (!ticket) {
      throw new TicketNotFound(id);
    }
    return ticket;
  }
}
