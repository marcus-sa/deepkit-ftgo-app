import { entity, UUID } from '@deepkit/type';

import { LineItemQuantityChange, OrderRevision } from './entities';

@entity.name('@error/order-minimum-not-met')
export class OrderMinimumNotMetException extends Error {}

@entity.name('@error/order-not-found')
export class OrderNotFound extends Error {
  constructor(readonly orderId: UUID) {
    super();
  }
}

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
