import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateModule } from 'deepkit-restate';

import { provideDatabase } from '@ftgo/common';

import { CourierServiceConfig } from './config';
import { CourierRepository } from './courier.repository';
import { CourierService } from './courier.service';
import { Courier } from './entities';

void new App({
  config: CourierServiceConfig,
  imports: [new FrameworkModule(), new RestateModule()],
  controllers: [CourierService],
  providers: [provideDatabase([Courier]), CourierRepository],
})
  .loadConfigFromEnv({ prefix: '' })
  .run();
