import { float, integer, Positive, UUID } from '@deepkit/type';

import { Address, Money, RevisedOrderLineItem } from '@ftgo/common';

export class OrderRevision {
  constructor(
    public readonly revisedOrderLineItems: readonly RevisedOrderLineItem[],
    public readonly deliveryInformation?: DeliveryInformation,
  ) {}
}

export class LineItemQuantityChange {
  constructor(
    public readonly currentOrderTotal: Money,
    public readonly newOrderTotal: Money,
    public readonly delta: Money,
  ) {}
}

export interface OrderLineItem {
  readonly name: string;
  readonly quantity: integer & Positive;
  readonly price: Money;
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
