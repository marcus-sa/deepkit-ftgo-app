import { RestateClient, RestateService } from 'deepkit-restate';
import { typeOf, UUID } from '@deepkit/type';
import { FactoryProvider } from '@deepkit/injector';

import { Restaurant } from './entities.js';
import { CreateRestaurantRequest } from './dtos.js';

export interface RestaurantServiceHandlers {
  create(request: CreateRestaurantRequest): Promise<Restaurant>;
}

export type RestaurantServiceApi = RestateService<
  'Restaurant',
  RestaurantServiceHandlers
>;

export function provideRestaurantServiceApi(): FactoryProvider<RestaurantServiceApi> {
  return {
    provide: typeOf<RestaurantServiceApi>(),
    useFactory: (restate: RestateClient) =>
      restate.service<RestaurantServiceApi>(),
  };
}
