import { integer, Positive, UUID } from '@deepkit/type';

export interface TicketLineItem {
  readonly quantity: integer & Positive;
  readonly menuItemId?: UUID;
  readonly name: string;
}

export interface TicketDetails {
  readonly lineItems: readonly TicketLineItem[];
}
