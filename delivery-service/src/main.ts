import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateModule } from 'deepkit-restate';

import { provideDatabase } from '@ftgo/common';
import { Delivery } from '@ftgo/delivery-service-api';

import { DeliveryServiceConfig } from './config.js';
import { DeliveryRepository } from './delivery.repository.js';
import { DeliveryService } from './delivery.service.js';

void new App({
  config: DeliveryServiceConfig,
  imports: [new FrameworkModule(), new RestateModule()],
  controllers: [DeliveryService],
  providers: [provideDatabase([Delivery]), DeliveryRepository],
})
  .setup((module, config: DeliveryServiceConfig) => {
    module
      .getImportedModuleByClass(FrameworkModule)
      .configure(config.framework);

    module.getImportedModuleByClass(RestateModule).configure(config.restate);
  })
  .loadConfigFromEnv({ prefix: '' })
  .run();
