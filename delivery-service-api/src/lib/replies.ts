import { entity, UUID } from '@deepkit/type';

@entity.name('@error/DeliveryCourierUnavailable')
export class DeliveryCourierUnavailable {
  constructor(
    public readonly deliveryId: UUID,
    public readonly orderId: UUID,
  ) {}
}

export class DeliveryCreated {
  constructor(public readonly deliveryId: UUID) {}
}

export class CourierAssigned {
  constructor(
    public readonly deliveryId: UUID,
    public readonly courierId: UUID,
  ) {}
}
