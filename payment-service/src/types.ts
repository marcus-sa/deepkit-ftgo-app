interface PaymentIntentLastPaymentError {
  readonly code: string;
  readonly message?: string;
}

export interface StripePaymentIntent {
  readonly id: string;
  readonly cancellation_reason: string | null;
  readonly last_payment_error: PaymentIntentLastPaymentError | null;
  readonly status: string;
}
