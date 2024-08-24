import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateKafkaProducerModule } from 'deepkit-restate/kafka';
import { RestateModule } from 'deepkit-restate';

import { Customer } from '@ftgo/customer-service-api';
import { provideDatabase } from '@ftgo/common';

import { CustomerServiceConfig } from './config';
import { CustomerService } from './customer.service';
import { CustomerRepository } from './customer.repository';

void new App({
  config: CustomerServiceConfig,
  imports: [
    new FrameworkModule(),
    new RestateModule(),
    // TODO: should be configurable through RestateModule
    new RestateKafkaProducerModule({
      clientId: 'customer-service',
      brokers: [''],
    }),
  ],
  controllers: [CustomerService],
  providers: [provideDatabase([Customer]), CustomerRepository],
})
  .loadConfigFromEnv({ prefix: '' })
  .run();
