import { createModule } from '@deepkit/app';

import { provideConsumerServiceApi } from '@ftgo/consumer-service-api';

import { ConsumerController } from './consumer.controller';

export class ConsumerModule extends createModule({
  controllers: [ConsumerController],
  providers: [provideConsumerServiceApi()],
}) {}
