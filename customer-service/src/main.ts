import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateModule } from 'deepkit-restate';

import { provideDatabase } from '@ftgo/common';

import { CustomerServiceConfig } from './config';
import { CustomerService } from './customer.service';
import { CustomerRepository } from './customer.repository';
import { Customer } from './entities';

void new App({
  config: CustomerServiceConfig,
  imports: [new FrameworkModule(), new RestateModule()],
  controllers: [CustomerService],
  providers: [provideDatabase([Customer]), CustomerRepository],
})
  .loadConfigFromEnv({ prefix: '' })
  .run();
