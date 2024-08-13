import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateModule } from 'deepkit-restate';

import { provideDatabase } from '@ftgo/common';
import { Account } from '@ftgo/accounting-service-api';

import { AccountingServiceConfig } from './config.js';
import { AccountingService } from './accounting.service.js';
import { AccountRepository } from './account.repository.js';

void new App({
  config: AccountingServiceConfig,
  imports: [new FrameworkModule(), new RestateModule()],
  controllers: [AccountingService],
  providers: [provideDatabase([Account]), AccountRepository],
})
  .setup((module, config: AccountingServiceConfig) => {
    module
      .getImportedModuleByClass(FrameworkModule)
      .configure(config.framework);

    module.getImportedModuleByClass(RestateModule).configure(config.restate);
  })
  .loadConfigFromEnv({ prefix: '' })
  .run();
