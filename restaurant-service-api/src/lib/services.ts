import { RestateClient, RestateService } from 'deepkit-restate';
import { typeOf, UUID } from '@deepkit/type';
import { FactoryProvider } from '@deepkit/injector';

import { Restaurant } from './entities';
import { CreateRestaurantRequest } from './dtos';

export interface RestaurantServiceHandlers {
  create(request: CreateRestaurantRequest): Promise<Restaurant>;
}

export type RestaurantServiceApi = RestateService<
  'Restaurant',
  RestaurantServiceHandlers
>;
