import {
  Embedded,
  entity,
  JSONEntity,
  JSONPartial,
  PrimaryKey,
  uuid,
  UUID,
} from '@deepkit/type';

import { Address, Money } from '@ftgo/common';

@entity.name('restaurant')
export class Restaurant {
  readonly id: UUID & PrimaryKey = uuid();
  readonly name: string;
  readonly address: Address;
  readonly menu: Embedded<RestaurantMenu>;

  static create(data: JSONPartial<Restaurant>): Restaurant {
    return Object.assign(new Restaurant(), data);
  }
}

export interface RestaurantMenu {
  readonly items: Embedded<MenuItem>[];
}

@entity.name('menu-item')
export class MenuItem {
  readonly id: UUID & PrimaryKey = uuid();

  constructor(
    readonly name: string,
    readonly price: Money,
  ) {}
}
