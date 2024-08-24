import { createModule } from '@deepkit/app';
import { provideRestateServiceProxy } from 'deepkit-restate';

import { CustomerServiceApi } from '@ftgo/customer-service-api';

import { ConsumerController } from './consumer.controller';

export class ConsumerModule extends createModule({
  controllers: [ConsumerController],
  providers: [provideRestateServiceProxy<CustomerServiceApi>()],
}) {}
