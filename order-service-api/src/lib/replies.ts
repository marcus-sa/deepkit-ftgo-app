import { entity, UUID } from '@deepkit/type';

import { LineItemQuantityChange, OrderRevision } from './entities';

@entity.name('@error/OrderMinimumNotMet')
export class OrderMinimumNotMet extends Error {}

@entity.name('@error/OrderLineItemNotFound')
export class OrderLineItemNotFound extends Error {}

@entity.name('@error/OrderNotFound')
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
