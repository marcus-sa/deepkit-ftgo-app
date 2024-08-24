import { ServiceConfig } from '@ftgo/common';

export class StripeConfig {
  readonly apiKey: string;
  readonly maxNetworkRetries: number = 0;
  readonly timeout: number = 80000;
}

export class PaymentServiceConfig extends ServiceConfig {
  readonly stripe: StripeConfig;
}
