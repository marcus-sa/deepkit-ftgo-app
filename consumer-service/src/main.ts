import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateKafkaProducerModule } from 'deepkit-restate/kafka';
import { RestateModule } from 'deepkit-restate';

import { provideDatabase } from '@ftgo/common';
import { Consumer } from '@ftgo/consumer-service-api';

import { ConsumerServiceConfig } from './config.js';
import { ConsumerService } from './consumer.service.js';
import { ConsumerRepository } from './consumer.repository.js';

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
  .setup((module, config: ConsumerServiceConfig) => {
    module
      .getImportedModuleByClass(FrameworkModule)
      .configure(config.framework);

    module.getImportedModuleByClass(RestateModule).configure(config.restate);
  })
  .loadConfigFromEnv({ prefix: '' })
  .run();
