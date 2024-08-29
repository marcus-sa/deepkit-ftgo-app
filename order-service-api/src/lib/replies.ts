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

export class OrderCreated {
  constructor(public readonly orderId: UUID) {}
}

export class OrderApproved {
  constructor(
    public readonly orderId: UUID,
    public readonly approvedAt: Date,
  ) {}
}

export class OrderRejected {
  constructor(
    public readonly orderId: UUID,
    public readonly rejectedAt: Date,
  ) {}
}

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
