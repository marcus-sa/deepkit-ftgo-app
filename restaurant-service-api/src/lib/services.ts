import { RestateService } from 'deepkit-restate';

import { Restaurant } from './entities';
import { CreateRestaurantRequest } from './dtos';

export interface RestaurantServiceHandlers {
  create(request: CreateRestaurantRequest): Promise<Restaurant>;
}

export type RestaurantServiceApi = RestateService<
  'Restaurant',
  RestaurantServiceHandlers
>;
