import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateModule } from 'deepkit-restate';
import { RestateKafkaProducerModule } from 'deepkit-restate/kafka';

import {
  provideRestaurantServiceApi,
  Restaurant,
} from '@ftgo/restaurant-service-api';
import { provideDatabase } from '@ftgo/common';

import { RestaurantServiceConfig } from './config';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { RestaurantRepository } from './restaurant.repository';

void new App({
  config: RestaurantServiceConfig,
  imports: [
    new FrameworkModule(),
    new RestateModule(),
    new RestateKafkaProducerModule({
      clientId: 'restaurant-service',
      brokers: [],
    }),
  ],
  controllers: [RestaurantController, RestaurantService],
  providers: [
    provideDatabase([Restaurant]),
    provideRestaurantServiceApi(),
    RestaurantRepository,
  ],
})
  .setup((module, config: RestaurantServiceConfig) => {
    module
      .getImportedModuleByClass(FrameworkModule)
      .configure(config.framework);

    module.getImportedModuleByClass(RestateModule).configure(config.restate);
  })
  .loadConfigFromEnv({ prefix: '' })
  .run();
