import { UUID } from '@deepkit/type';

export class TicketNotFound {
  constructor(readonly ticketId: UUID) {}
}

export class TicketConfirmed {
  constructor(readonly readyAt: Date) {}
}

export class TicketCreated {
  constructor(readonly ticketId: UUID) {}
}
