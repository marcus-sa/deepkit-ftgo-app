import { Money } from '@ftgo/common';

export interface MenuItem {
  readonly name: string;
  readonly price: Money;
}

export interface Menu {
  readonly items: MenuItem[];
}
