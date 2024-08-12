import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateModule } from 'deepkit-restate';

import { provideDatabase } from '@ftgo/common';

import { DeliveryServiceConfig } from './config';
import { DeliveryRepository } from './delivery.repository';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';

void new App({
  config: DeliveryServiceConfig,
  imports: [new FrameworkModule(), new RestateModule()],
  controllers: [DeliveryController, DeliveryService],
  providers: [provideDatabase([]), DeliveryRepository],
})
  .setup((module, config: DeliveryServiceConfig) => {
    module
      .getImportedModuleByClass(FrameworkModule)
      .configure(config.framework);

    module.getImportedModuleByClass(RestateModule).configure(config.restate);
  })
  .loadConfigFromEnv({ prefix: '' })
  .run();
