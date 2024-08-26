import { cast, Embedded, entity, PrimaryKey, uuid, UUID } from '@deepkit/type';
import { Address, Money } from '@ftgo/common';

@entity.name('restaurant')
export class Restaurant {
  readonly id: UUID & PrimaryKey = uuid();

  constructor(
    public readonly name: string,
    public readonly address: Address,
    public readonly menu: Menu,
  ) {}
}

export interface Menu {
  readonly items: MenuItem[];
}

@entity.name('restaurant-menu-item')
export class MenuItem {
  readonly id: UUID & PrimaryKey = uuid();

  constructor(
    public readonly name: string,
    public readonly price: Money,
  ) {}
}
