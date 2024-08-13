import { createModule } from '@deepkit/app';
import { provideRestateServiceProxy } from 'deepkit-restate';

import { RestaurantServiceApi } from '@ftgo/restaurant-service-api';

import { RestaurantController } from './restaurant.controller';

export class RestaurantModule extends createModule({
  controllers: [RestaurantController],
  providers: [provideRestateServiceProxy<RestaurantServiceApi>()],
}) {}
