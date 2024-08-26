import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateModule } from 'deepkit-restate';

import { provideDatabase } from '@ftgo/common';

import { DeliveryServiceConfig } from './config';
import { DeliveryRepository } from './delivery.repository';
import { DeliveryService } from './delivery.service';
import { Delivery } from './entities';

void new App({
  config: DeliveryServiceConfig,
  imports: [new FrameworkModule(), new RestateModule()],
  controllers: [DeliveryService],
  providers: [provideDatabase([Delivery]), DeliveryRepository],
})
  .loadConfigFromEnv({ prefix: '' })
  .run();
