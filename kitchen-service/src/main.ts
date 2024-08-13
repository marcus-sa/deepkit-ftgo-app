import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateModule } from 'deepkit-restate';

import { provideDatabase } from '@ftgo/common';

import { KitchenServiceConfig } from './config.js';
import { KitchenRepository } from './kitchen.repository.js';
import { KitchenController } from './kitchen.controller.js';
import { KitchenService } from './kitchen.service.js';

void new App({
  config: KitchenServiceConfig,
  imports: [new FrameworkModule(), new RestateModule()],
  controllers: [KitchenController, KitchenService],
  providers: [provideDatabase([]), KitchenRepository],
})
  .setup((module, config: KitchenServiceConfig) => {
    module
      .getImportedModuleByClass(FrameworkModule)
      .configure(config.framework);

    module.getImportedModuleByClass(RestateModule).configure(config.restate);
  })
  .loadConfigFromEnv({ prefix: '' })
  .run();
