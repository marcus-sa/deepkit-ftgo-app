import _Stripe from 'stripe';

import { StripeConfig } from './config';

export class Stripe extends _Stripe {
  constructor({ apiKey, maxNetworkRetries, timeout }: StripeConfig) {
    super(apiKey, {
      apiVersion: '2024-06-20',
      maxNetworkRetries,
      timeout,
    });
  }
}

export const { StripeCardError } = _Stripe.errors;
