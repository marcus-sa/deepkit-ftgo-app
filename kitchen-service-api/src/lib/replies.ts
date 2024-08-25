import { UUID } from '@deepkit/type';

export class TicketNotFound {
  constructor(public readonly ticketId: UUID) {}
}

export class TicketConfirmed {
  constructor(public readonly readyAt: Date) {}
}

export class TicketCreated {
  constructor(public readonly ticketId: UUID) {}
}
