import { UUID } from '@deepkit/type';

interface PaymentIntentLastPaymentError {
  readonly code: string;
  readonly message?: string;
}

export interface StripePaymentIntent {
  readonly id: UUID;
  readonly cancellation_reason: string | null;
  readonly last_payment_error: PaymentIntentLastPaymentError | null;
  readonly status: string;
}
