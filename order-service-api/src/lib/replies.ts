import { entity, UUID } from '@deepkit/type';

import { LineItemQuantityChange, OrderRevision } from './entities';

@entity.name('@error/order-minimum-not-met')
export class OrderMinimumNotMetException extends Error {}

@entity.name('@error/order-not-found')
export class OrderNotFound extends Error {
  constructor(public readonly orderId: UUID) {
    super();
  }
}

export class OrderApproved {}

export class OrderRejected {}

export class OrderRevisionProposed {
  constructor(
    public readonly revision: OrderRevision,
    public readonly change: LineItemQuantityChange,
  ) {}
}

export class OrderRevised {
  constructor(
    public readonly revision: OrderRevision,
    public readonly change: LineItemQuantityChange,
  ) {}
}
