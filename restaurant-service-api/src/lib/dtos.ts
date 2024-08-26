import { UUID } from '@deepkit/type';

import { Address } from '@ftgo/common';

import { Menu } from './types';

export interface CreateRestaurantRequest {
  readonly name: string;
  readonly address: Address;
  readonly menu: Menu;
}

export interface CreateRestaurantResponse {
  readonly id: UUID;
}
