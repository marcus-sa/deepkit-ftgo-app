import { integer, Positive, UUID } from '@deepkit/type';

import { Money, RevisedOrderLineItem } from '@ftgo/common';
import { DeliveryInformation } from '@ftgo/delivery-service-api';
import { PaymentInformation } from '@ftgo/payment-service-api';

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
  readonly deliveryInformation: DeliveryInformation;
  readonly paymentInformation: PaymentInformation;
  readonly orderTotal: Money;
}

// @entity.name('delivery-information')
// export class DeliveryInformation {
//   constructor(readonly address: Address, readonly time: Date) {}
// }
