import { entity } from '@deepkit/type';

import { LineItemQuantityChange, OrderRevision } from './entities';

@entity.name('@error/order-minimum-not-met')
export class OrderMinimumNotMetException extends Error {}

export class OrderRevisionProposed {
  constructor(
    readonly revision: OrderRevision,
    readonly change: LineItemQuantityChange,
  ) {}
}

export class OrderRevised {
  constructor(
    readonly revision: OrderRevision,
    readonly change: LineItemQuantityChange,
  ) {}
}
