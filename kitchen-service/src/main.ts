import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateModule } from 'deepkit-restate';

import { provideDatabase } from '@ftgo/common';
import { Kitchen } from '@ftgo/kitchen-service-api';

import { KitchenServiceConfig } from './config';
import { KitchenRepository } from './kitchen.repository';
import { KitchenService } from './kitchen.service';

void new App({
  config: KitchenServiceConfig,
  imports: [new FrameworkModule(), new RestateModule()],
  controllers: [KitchenService],
  providers: [provideDatabase([Kitchen]), KitchenRepository],
})
  .setup((module, config: KitchenServiceConfig) => {
    module
      .getImportedModuleByClass(FrameworkModule)
      .configure(config.framework);

    module.getImportedModuleByClass(RestateModule).configure(config.restate);
  })
  .loadConfigFromEnv({ prefix: '' })
  .run();
