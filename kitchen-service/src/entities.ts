import { entity, integer, Positive, UUID } from '@deepkit/type';
import { Writable } from 'type-fest';

import { UnsupportedStateTransitionException } from '@ftgo/common';

@entity.name('kitchen')
export class Kitchen {}

@entity.name('ticket-line-item')
export class TicketLineItem {
  readonly quantity: integer & Positive;
  readonly menuItemId: UUID;
  readonly name: string;
}

export interface TicketDetails {
  readonly lineItems: readonly TicketLineItem[];
}

export enum TicketState {
  CREATED = 'CREATED',
  REJECTED = 'REJECTED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

@entity.name('ticket')
export class Ticket {
  readonly id: UUID;
  readonly state: TicketState = TicketState.CREATED;
  readonly createdAt: Date = new Date();
  readonly rejectedAt?: Date;
  readonly rejectionReason?: string;
  readonly cancelledAt?: Date;
  readonly cancellationReason?: string;
  readonly confirmedAt?: Date;
  readonly confirmCancelAwakeableId?: string;

  constructor(
    public readonly restaurantId: UUID,
    public readonly orderId: UUID,
    public readonly details: TicketDetails,
    public readonly confirmAwakeableId: string,
  ) {}

  reject(this: Writable<this>, reason: string) {
    if (this.state !== TicketState.CREATED) {
      throw new UnsupportedStateTransitionException(this.state);
    }
    this.state = TicketState.REJECTED;
    this.rejectedAt = new Date();
    this.rejectionReason = reason;
  }

  cancel(this: Writable<this>, reason?: string) {
    if (this.state !== TicketState.CONFIRMED) {
      throw new UnsupportedStateTransitionException(this.state);
    }
    this.state = TicketState.CANCELLED;
    this.cancelledAt = new Date();
    this.cancellationReason = reason;
  }

  confirm(this: Writable<this>): void {
    if (this.state !== TicketState.CREATED) {
      throw new UnsupportedStateTransitionException(this.state);
    }
    this.state = TicketState.CONFIRMED;
    this.confirmedAt = new Date();
  }

  setConfirmCancelAwakeableId(this: Writable<this>, value: string) {
    this.confirmCancelAwakeableId = value;
  }
}
