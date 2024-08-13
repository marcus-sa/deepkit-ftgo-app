import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateModule } from 'deepkit-restate';
import { RestateKafkaProducerModule } from 'deepkit-restate/kafka';

import {
  provideRestaurantServiceApi,
  Restaurant,
} from '@ftgo/restaurant-service-api';
import { provideDatabase } from '@ftgo/common';

import { RestaurantServiceConfig } from './config.js';
import { RestaurantService } from './restaurant.service.js';
import { RestaurantRepository } from './restaurant.repository.js';

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
  controllers: [RestaurantService],
  providers: [provideDatabase([Restaurant]), RestaurantRepository],
})
  .setup((module, config: RestaurantServiceConfig) => {
    module
      .getImportedModuleByClass(FrameworkModule)
      .configure(config.framework);

    module.getImportedModuleByClass(RestateModule).configure(config.restate);
  })
  .loadConfigFromEnv({ prefix: '' })
  .run();
