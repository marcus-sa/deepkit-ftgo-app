import { ItemNotFound } from '@deepkit/orm';
import { Writable } from 'type-fest';
import {
  Embedded,
  entity,
  integer,
  JSONEntity,
  JSONPartial,
  Positive,
  PrimaryKey,
  UUID,
} from '@deepkit/type';

import {
  Address,
  Money,
  RevisedOrderLineItem,
  UnsupportedStateTransitionException,
} from '@ftgo/common';
import {
  OrderMinimumNotMetException,
  OrderRevised,
  OrderRevisionProposed,
} from './replies';

export enum OrderState {
  APPROVAL_PENDING = 'APPROVAL_PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCEL_PENDING = 'CANCEL_PENDING',
  CANCELLED = 'CANCELLED',
  REVISION_PENDING = 'REVISION_PENDING',
}

@entity.name('order')
export class Order {
  readonly id: UUID & PrimaryKey;
  readonly state: OrderState = OrderState.APPROVAL_PENDING;
  readonly paymentInformation?: Embedded<PaymentInformation>;
  readonly orderMinimum: Embedded<Money> = new Money(Number.MAX_SAFE_INTEGER);

  readonly customerId: UUID;
  readonly restaurantId: UUID;
  readonly deliveryInformation: Embedded<DeliveryInformation>;
  readonly lineItems: OrderLineItems;

  static create(data: JSONPartial<Order>): Order {
    return Object.assign(new Order(), data);
  }

  cancel(this: Writable<this>): void {
    if (this.state !== OrderState.APPROVED) {
      throw new UnsupportedStateTransitionException(this.state);
    }
    this.state = OrderState.CANCEL_PENDING;
  }

  undoPendingCancel(this: Writable<this>): void {
    if (this.state !== OrderState.CANCEL_PENDING) {
      throw new UnsupportedStateTransitionException(this.state);
    }
    this.state = OrderState.APPROVED;
  }

  noteCancelled(this: Writable<this>): void {
    if (this.state !== OrderState.CANCEL_PENDING) {
      throw new UnsupportedStateTransitionException(this.state);
    }
    this.state = OrderState.CANCELLED;
  }

  noteApproved(this: Writable<this>): void {
    if (this.state !== OrderState.APPROVAL_PENDING) {
      throw new UnsupportedStateTransitionException(this.state);
    }
    this.state = OrderState.APPROVED;
  }

  noteRejected(this: Writable<this>) {
    if (this.state !== OrderState.APPROVAL_PENDING) {
      throw new UnsupportedStateTransitionException(this.state);
    }
    this.state = OrderState.REJECTED;
  }

  noteReservingPayment() {}

  noteReversingPayment() {}

  revise(this: Writable<this>, revision: OrderRevision): OrderRevisionProposed {
    if (this.state !== OrderState.APPROVED) {
      throw new UnsupportedStateTransitionException(this.state);
    }
    const change = this.lineItems.getLineItemQuantityChange(revision);
    if (change.newOrderTotal.isGreaterThanOrEqual(this.orderMinimum)) {
      throw new OrderMinimumNotMetException();
    }
    this.state = OrderState.REVISION_PENDING;
    return new OrderRevisionProposed(revision, change);
  }

  rejectRevision(this: Writable<this>): void {
    if (this.state !== OrderState.REVISION_PENDING) {
      throw new UnsupportedStateTransitionException(this.state);
    }
    this.state = OrderState.APPROVED;
  }

  confirmRevision(this: Writable<this>, revision: OrderRevision): OrderRevised {
    if (this.state !== OrderState.REVISION_PENDING) {
      throw new UnsupportedStateTransitionException(this.state);
    }

    if (revision.deliveryInformation) {
      this.deliveryInformation = revision.deliveryInformation;
    }

    if (revision.revisedOrderLineItems.length) {
      this.lineItems.updateLineItems(revision);
    }

    this.state = OrderState.APPROVED;

    const change = this.lineItems.getLineItemQuantityChange(revision);
    return new OrderRevised(revision, change);
  }
}

// @entity.name('order-revision')
export class OrderRevision {
  constructor(
    readonly revisedOrderLineItems: readonly RevisedOrderLineItem[],
    readonly deliveryInformation?: DeliveryInformation,
  ) {}
}

export class OrderLineItems {
  constructor(readonly lineItems: readonly OrderLineItem[]) {}

  changeToOrderTotal(orderRevision: OrderRevision) {}

  find(menuItemId: UUID): OrderLineItem {
    const item = this.lineItems.find(
      lineItem => lineItem.menuItemId === menuItemId,
    );
    if (!item) {
      throw new ItemNotFound(menuItemId);
    }
    return item;
  }

  updateLineItems(orderRevision: OrderRevision) {}

  getOrderTotal(): Money {
    return this.lineItems
      .map(lineItem => lineItem.getTotal())
      .reduce((left, right) => left.add(right), Money.ZERO);
  }

  getLineItemQuantityChange(
    orderRevision: OrderRevision,
  ): LineItemQuantityChange {}
}

export class LineItemQuantityChange {
  constructor(
    readonly currentOrderTotal: Money,
    readonly newOrderTotal: Money,
    readonly delta: Money,
  ) {}
}

@entity.name('order-line-item')
export class OrderLineItem {
  readonly quantity: integer & Positive;
  readonly menuItemId: UUID;
  readonly name: string;
  readonly price: Money;

  deltaForChangedQuantity(newQuantity: integer & Positive): Money {
    return this.price.multiply(newQuantity - this.quantity);
  }

  getTotal(): Money {
    return this.price.multiply(this.quantity);
  }
}

export interface OrderDetails {
  readonly customerId: UUID;
  readonly restaurantId: UUID;
  readonly lineItems: readonly OrderLineItem[];
  readonly orderTotal: Money;
}

export interface DeliveryInformation {
  readonly address: Address;
  readonly time: Date;
}

export interface PaymentInformation {}

// @entity.name('delivery-information')
// export class DeliveryInformation {
//   constructor(readonly address: Address, readonly time: Date) {}
// }
