import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateModule } from 'deepkit-restate';

import { provideDatabase } from '@ftgo/common';
import { Account } from '@ftgo/accounting-service-api';

import { AccountingServiceConfig } from './config';
import { AccountingService } from './accounting.service';
import { AccountRepository } from './account.repository';

void new App({
  config: AccountingServiceConfig,
  imports: [new FrameworkModule(), new RestateModule()],
  controllers: [AccountingService],
  providers: [provideDatabase([Account]), AccountRepository],
})
  .loadConfigFromEnv({ prefix: '' })
  .run();
