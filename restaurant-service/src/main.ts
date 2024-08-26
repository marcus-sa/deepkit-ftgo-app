import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateModule } from 'deepkit-restate';

import { provideDatabase } from '@ftgo/common';

import { RestaurantServiceConfig } from './config';
import { RestaurantService } from './restaurant.service';
import { RestaurantRepository } from './restaurant.repository';
import { Restaurant } from './entities';

void new App({
  config: RestaurantServiceConfig,
  imports: [new FrameworkModule(), new RestateModule()],
  controllers: [RestaurantService],
  providers: [provideDatabase([Restaurant]), RestaurantRepository],
})
  .loadConfigFromEnv({ prefix: '' })
  .run();
