import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateModule } from 'deepkit-restate';

import { provideDatabase } from '@ftgo/common';
import { Payment, StripeCustomer } from '@ftgo/payment-service-api';

import { PaymentServiceConfig } from './config';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './payment.repository';
import { Stripe } from './stripe';
import { StripeCustomerRepository } from './stripe-customer.repository';

void new App({
  config: PaymentServiceConfig,
  imports: [new FrameworkModule(), new RestateModule()],
  controllers: [PaymentService],
  providers: [
    provideDatabase([Payment, StripeCustomer]),
    PaymentRepository,
    StripeCustomerRepository,
    Stripe,
  ],
})
  .loadConfigFromEnv({ prefix: '' })
  .run();
