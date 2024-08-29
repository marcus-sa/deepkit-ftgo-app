import { UUID } from '@deepkit/type';
import { Address } from '@ftgo/common';

export interface DeliveryInformation {
  readonly address: Address;
  readonly time: Date;
}

export interface DeliveryDetails {
  readonly customerId: UUID;
  readonly restaurantId: UUID;
  readonly deliveryInformation: DeliveryInformation;
}
