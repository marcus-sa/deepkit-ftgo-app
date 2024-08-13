import { UUID } from '@deepkit/type';

import { Address } from '@ftgo/common';

import { RestaurantMenu } from './entities';

export interface CreateRestaurantRequest {
  readonly name: string;
  readonly address: Address;
  readonly menu: RestaurantMenu;
}

export interface CreateRestaurantResponse {
  readonly id: UUID;
}
