import { entity, PrimaryKey, Unique, uuid, UUID } from '@deepkit/type';
import { Money, UnsupportedStateTransitionException } from '@ftgo/common';
import { Writable } from 'type-fest';
import { Stripe } from 'stripe';

export enum PaymentState {
  AUTHORIZED = 'AUTHORIZED', // same as requires_confirmation
  REFUNDED = 'REFUNDED',
  REVERSED = 'REVERSED',
  AUTHORIZATION_REVERSED = 'AUTHORIZATION_REVERSED',
  REQUIRES_CONFIRMATION = 'requires_confirmation', // same as AUTHORIZED
  REQUIRES_PAYMENT_METHOD = 'requires_payment_method',
  PROCESSING = 'processing',
  REQUIRES_ACTION = 'requires_action',
  REQUIRES_CAPTURE = 'requires_capture',
  CANCELLED = 'CANCELED',
}

@entity.name('payment')
export class Payment {
  readonly id: UUID & PrimaryKey = uuid();
  readonly state: PaymentState;
  readonly cancelledAt?: Date;

  constructor(
    public readonly customerId: UUID,
    public readonly orderId: UUID,
    public readonly orderTotal: Money,
    public readonly stripePaymentIntentId: string & Unique,
    stripePaymentIntentStatus: Stripe.PaymentIntent.Status,
  ) {
    this.state = stripePaymentIntentStatus as PaymentState;
  }

  cancel(this: Writable<this>) {
    if (
      this.state !== PaymentState.AUTHORIZED &&
      this.state !== PaymentState.REQUIRES_CONFIRMATION
    ) {
      throw new UnsupportedStateTransitionException(this.state);
    }
    this.state = PaymentState.CANCELLED;
    this.cancelledAt = new Date();
  }
}
