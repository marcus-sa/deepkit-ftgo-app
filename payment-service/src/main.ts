import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateModule } from 'deepkit-restate';

import { provideDatabase } from '@ftgo/common';
import { PaymentCustomer } from '@ftgo/payment-service-api';

import { PaymentServiceConfig } from './config';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './payment.repository';
import { Stripe } from './stripe';
import { CustomerRepository } from './customer.repository';
import { Payment } from './entities';

void new App({
  config: PaymentServiceConfig,
  imports: [new FrameworkModule(), new RestateModule()],
  controllers: [PaymentService],
  providers: [
    provideDatabase([Payment, PaymentCustomer]),
    PaymentRepository,
    CustomerRepository,
    Stripe,
  ],
})
  .loadConfigFromEnv({ prefix: '' })
  .run();
