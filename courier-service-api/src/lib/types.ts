import { UUID } from '@deepkit/type';
import { Address } from '@ftgo/common';

export interface CourierInformation {
  readonly address: Address;
  readonly time: Date;
}

export interface CourierDetails {
  readonly customerId: UUID;
  readonly restaurantId: UUID;
  readonly courierInformation: CourierInformation;
}
