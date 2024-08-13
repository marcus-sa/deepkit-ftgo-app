import { createModule } from '@deepkit/app';

import { provideRestaurantServiceApi } from '@ftgo/restaurant-service-api';

import { RestaurantController } from './restaurant.controller';

export class RestaurantModule extends createModule({
  controllers: [RestaurantController],
  providers: [provideRestaurantServiceApi()],
}) {}
