import { entity, PrimaryKey, Unique, uuid, UUID } from '@deepkit/type';
import { Money, UnsupportedStateTransitionException } from '@ftgo/common';
import { Writable } from 'type-fest';

export enum PaymentState {
  AUTHORIZED = 'AUTHORIZED',
  REFUNDED = 'REFUNDED',
  REVERSED = 'REVERSED',
  AUTHORIZATION_REVERSED = 'AUTHORIZATION_REVERSED',
  CANCELLED = 'CANCELLED',
}

@entity.name('payment')
export class Payment {
  readonly id: UUID & PrimaryKey = uuid();
  readonly state: PaymentState = PaymentState.AUTHORIZED;
  readonly cancelledAt?: Date;

  constructor(
    public readonly customerId: UUID,
    public readonly orderId: UUID,
    public readonly orderTotal: Money,
    public readonly stripePaymentIntentId: string & Unique,
    public readonly stripePaymentIntentStatus: string,
  ) {}

  cancel(this: Writable<this>) {
    if (this.state !== PaymentState.AUTHORIZED) {
      throw new UnsupportedStateTransitionException(this.state);
    }
    this.state = PaymentState.CANCELLED;
    this.cancelledAt = new Date();
  }
}
