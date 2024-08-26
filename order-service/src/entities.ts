import {
  BackReference,
  Embedded,
  entity,
  integer,
  JSONPartial,
  Positive,
  PrimaryKey,
  Reference,
  UUID,
} from '@deepkit/type';
import { Writable } from 'type-fest';

import { Money, UnsupportedStateTransitionException } from '@ftgo/common';

import {
  DeliveryInformation,
  LineItemQuantityChange,
  OrderLineItemNotFound,
  OrderMinimumNotMet,
  OrderRevised,
  OrderRevision,
  OrderRevisionProposed,
  PaymentInformation,
} from '@ftgo/order-service-api';

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
  readonly lineItems: Embedded<OrderLineItems>;

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
      throw new OrderMinimumNotMet();
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

@entity.name('order-line-item')
export class OrderLineItem {
  readonly quantity: integer & Positive;
  readonly menuItemId: UUID;
  readonly orderId: Order & Reference;
  readonly name: string;
  readonly price: Money;

  static create(data: JSONPartial<OrderLineItem>) {
    return Object.assign(new OrderLineItem(), data);
  }

  deltaForChangedQuantity(newQuantity: integer & Positive): Money {
    return this.price.multiply(newQuantity - this.quantity);
  }

  getTotal(): Money {
    return this.price.multiply(this.quantity);
  }
}

export class OrderLineItems {
  constructor(
    public readonly lineItems: readonly OrderLineItem[] & BackReference,
  ) {}

  changeToOrderTotal(orderRevision: OrderRevision) {
    throw new Error('Not yet implemented');
  }

  find(menuItemId: UUID): OrderLineItem {
    const item = this.lineItems.find(
      lineItem => lineItem.menuItemId === menuItemId,
    );
    if (!item) {
      throw new OrderLineItemNotFound(menuItemId);
    }
    return item;
  }

  updateLineItems(orderRevision: OrderRevision) {
    throw new Error('Not yet implemented');
  }

  getOrderTotal(): Money {
    return this.lineItems
      .map(lineItem => lineItem.getTotal())
      .reduce((left, right) => left.add(right), Money.ZERO);
  }

  getLineItemQuantityChange(
    orderRevision: OrderRevision,
  ): LineItemQuantityChange {
    throw new Error('Not yet implemented');
  }
}
