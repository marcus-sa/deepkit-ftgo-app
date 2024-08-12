import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateKafkaProducerModule } from 'deepkit-restate/kafka';
import { RestateModule } from 'deepkit-restate';

import {
  Account,
  provideAccountingServiceApi,
} from '@ftgo/accounting-service-api';

import { ConsumerServiceConfig } from './config';
import { provideDatabase } from '@ftgo/common';
import { ConsumerController } from './consumer.controller';
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
  controllers: [ConsumerController, ConsumerService],
  providers: [
    provideDatabase([Account]),
    provideAccountingServiceApi(),
    ConsumerRepository,
  ],
})
  .setup((module, config: ConsumerServiceConfig) => {
    module
      .getImportedModuleByClass(FrameworkModule)
      .configure(config.framework);

    module.getImportedModuleByClass(RestateModule).configure(config.restate);
  })
  .loadConfigFromEnv({ prefix: '' })
  .run();
