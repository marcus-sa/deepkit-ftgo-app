import { entity, UUID } from '@deepkit/type';

@entity.name('@error/CourierUnavailable')
export class CourierUnavailable {
  constructor(
    public readonly courierId: UUID,
    public readonly requestedDeliveryId: UUID,
    public readonly currentDeliveryId?: UUID,
  ) {}
}

export class CourierCreated {
  constructor(public readonly courierId: UUID) {}
}

export class CourierDeliveryAssigned {
  constructor(
    public readonly courierId: UUID,
    public readonly deliveryId: UUID,
  ) {}
}
