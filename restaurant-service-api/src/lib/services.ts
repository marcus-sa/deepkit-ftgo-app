import { RestateService } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { Address } from '@ftgo/common';

import { Menu } from './types';

export interface RestaurantServiceHandlers {
  create(name: string, address: Address, menu: Menu): Promise<UUID>;
}

export type RestaurantServiceApi = RestateService<
  'Restaurant',
  RestaurantServiceHandlers
>;
