import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateModule } from 'deepkit-restate';

import { provideDatabase } from '@ftgo/common';

import { OrderHistoryServiceConfig } from './config.js';
import { OrderHistoryController } from './order-history.controller.js';

void new App({
  config: OrderHistoryServiceConfig,
  imports: [new FrameworkModule(), new RestateModule()],
  controllers: [OrderHistoryController],
  providers: [provideDatabase([])],
})
  .setup((module, config: OrderHistoryServiceConfig) => {
    module
      .getImportedModuleByClass(FrameworkModule)
      .configure(config.framework);

    module.getImportedModuleByClass(RestateModule).configure(config.restate);
  })
  .loadConfigFromEnv({ prefix: '' })
  .run();
