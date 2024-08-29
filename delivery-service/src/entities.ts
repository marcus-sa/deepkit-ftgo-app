import { entity, PrimaryKey, uuid, UUID } from '@deepkit/type';

import { DeliveryInformation } from '@ftgo/delivery-service-api';

export enum DeliveryState {
  CREATED = 'CREATED',
  STARTED = 'STARTED',
  WAITING_FOR_COURIER = 'WAITING_FOR_COURIER',
  PROCESSING = 'PROCESSING', // DELIVERING,
  COMPLETED = 'COMPLETED',
}

@entity.name('delivery')
export class Delivery {
  readonly id: UUID & PrimaryKey = uuid();
  readonly state: DeliveryState = DeliveryState.CREATED;

  constructor(
    public readonly orderId: UUID,
    public readonly customerId: UUID,
    public readonly restaurantId: UUID,
    public readonly deliveryInformation: DeliveryInformation,
    public readonly courierAssignmentAwakeableId: string,
  ) {}
}
