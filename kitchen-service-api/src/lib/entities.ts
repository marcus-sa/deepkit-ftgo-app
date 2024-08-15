import { entity, integer, JSONEntity, Positive, UUID } from '@deepkit/type';
import { Writable } from 'type-fest';

@entity.name('kitchen')
export class Kitchen {
  static create(data: JSONEntity<Kitchen>): Kitchen {
    return new Kitchen();
  }
}

export enum TicketState {
  CREATED = 'CREATED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export interface TicketAwakeables {
  readonly confirmCreate: string;
}

@entity.name('ticket')
export class Ticket {
  readonly id: UUID;
  readonly state: TicketState = TicketState.CREATED;
  readonly confirmCreateAwakeableId?: string;
  readonly confirmCancelAwakeableId?: string;

  constructor(
    readonly restaurantId: UUID,
    readonly orderId: UUID,
    readonly details: TicketDetails,
    confirmCreateAwakeableId: string,
  ) {
    this.confirmCreateAwakeableId = confirmCreateAwakeableId;
  }

  cancel(this: Writable<this>) {
    this.state = TicketState.CANCELLED;
    // delete this.confirmCancelAwakeableId;
  }

  confirm(this: Writable<this>): void {
    this.state = TicketState.CONFIRMED;
    // delete this.confirmCreateAwakeableId;
  }

  setConfirmCancelAwakeableId(this: Writable<this>, value: string) {
    this.confirmCancelAwakeableId = value;
  }
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
