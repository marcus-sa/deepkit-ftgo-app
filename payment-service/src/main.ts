import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateModule } from 'deepkit-restate';

import { provideDatabase } from '@ftgo/common';
import { Payment } from '@ftgo/payment-service-api';

import { PaymentServiceConfig } from './config';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './payment.repository';

void new App({
  config: PaymentServiceConfig,
  imports: [new FrameworkModule(), new RestateModule()],
  controllers: [PaymentService],
  providers: [provideDatabase([Payment]), PaymentRepository],
})
  .loadConfigFromEnv({ prefix: '' })
  .run();
