import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateModule } from 'deepkit-restate';
import { RestateKafkaProducerModule } from 'deepkit-restate/kafka';

import { Restaurant } from '@ftgo/restaurant-service-api';
import { provideDatabase } from '@ftgo/common';

import { RestaurantServiceConfig } from './config';
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
  controllers: [RestaurantService],
  providers: [provideDatabase([Restaurant]), RestaurantRepository],
})
  .loadConfigFromEnv({ prefix: '' })
  .run();
