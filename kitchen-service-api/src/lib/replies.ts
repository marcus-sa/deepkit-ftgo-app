import { entity, UUID } from '@deepkit/type';

@entity.name('@error/TicketNotFound')
export class TicketNotFound extends Error {
  constructor(public readonly ticketId: UUID) {
    super();
  }
}

export class TicketConfirmed {
  constructor(public readonly readyAt: Date) {}
}

export class TicketCancelled {
  constructor(public readonly ticketId: UUID) {}
}

@entity.name('@error/TicketCancellationFailed')
export class TicketCancellationFailed extends Error {}

export class TicketCreated {
  constructor(public readonly ticketId: UUID) {}
}

export class TicketRejected {
  constructor(
    public readonly ticketId: UUID,
    public readonly rejectedAt: Date,
  ) {}
}
