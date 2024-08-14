import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateModule } from 'deepkit-restate';

import { provideDatabase } from '@ftgo/common';

import { OrderHistoryServiceConfig } from './config';
import { OrderHistoryController } from './order-history.controller';

void new App({
  config: OrderHistoryServiceConfig,
  imports: [new FrameworkModule(), new RestateModule()],
  controllers: [OrderHistoryController],
  providers: [provideDatabase([])],
})
  .loadConfigFromEnv({ prefix: '' })
  .run();
