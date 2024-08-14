import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateKafkaProducerModule } from 'deepkit-restate/kafka';
import { RestateModule } from 'deepkit-restate';

import { Consumer } from '@ftgo/consumer-service-api';
import { provideDatabase } from '@ftgo/common';

import { ConsumerServiceConfig } from './config';
import { ConsumerService } from './consumer.service';
import { ConsumerRepository } from './consumer.repository';

void new App({
  config: ConsumerServiceConfig,
  imports: [
    new FrameworkModule(),
    new RestateModule(),
    // TODO: should be configurable through RestateModule
    new RestateKafkaProducerModule({
      clientId: 'consumer-service',
      brokers: [''],
    }),
  ],
  controllers: [ConsumerService],
  providers: [provideDatabase([Consumer]), ConsumerRepository],
})
  .loadConfigFromEnv({ prefix: '' })
  .run();
