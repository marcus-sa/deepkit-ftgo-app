import { createModule } from '@deepkit/app';
import { provideRestateServiceProxy } from 'deepkit-restate';

import { ConsumerServiceApi } from '@ftgo/consumer-service-api';

import { ConsumerController } from './consumer.controller';

export class ConsumerModule extends createModule({
  controllers: [ConsumerController],
  providers: [provideRestateServiceProxy<ConsumerServiceApi>()],
}) {}
