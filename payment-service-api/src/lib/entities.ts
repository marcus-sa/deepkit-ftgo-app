import { Writable } from 'type-fest';
import {
  entity,
  float,
  JSONPartial,
  PrimaryKey,
  Unique,
  uuid,
  UUID,
} from '@deepkit/type';

import { Money, UnsupportedStateTransitionException } from '@ftgo/common';

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
  readonly orderId: UUID;
  readonly orderTotal: Money;
  readonly stripePaymentIntentId: UUID & Unique;
  readonly status: string; // stripe payment intent status
  readonly state: PaymentState = PaymentState.AUTHORIZED;

  static create(data: JSONPartial<Payment>) {
    return Object.assign(new Payment(), data);
  }

  cancel(this: Writable<this>) {
    if (this.state !== PaymentState.AUTHORIZED) {
      throw new UnsupportedStateTransitionException(this.state);
    }
    this.state = PaymentState.CANCELLED;
  }
}

@entity.name('stripe-customer')
export class StripeCustomer {
  readonly id: UUID & PrimaryKey;
  readonly customerId: UUID & Unique;

  static create(data: JSONPartial<StripeCustomer>) {
    return Object.assign(new StripeCustomer(), data);
  }
}
