import { entity, integer, JSONEntity, Positive, UUID } from '@deepkit/type';

@entity.name('kitchen')
export class Kitchen {
  static create(data: JSONEntity<Kitchen>): Kitchen {
    return new Kitchen();
  }
}

@entity.name('ticket')
export class Ticket {
  readonly id: UUID;
}

@entity.name('ticket-line-item')
export class TicketLineItem {
  readonly quantity: integer & Positive;
  readonly menuItemId: UUID;
  readonly name: string;
}

export interface TicketDetails {
  readonly lineItems: readonly TicketLineItem[];
}
