import { restate } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import {
  DeliveryCreated,
  DeliveryInformation,
  DeliveryServiceApi,
  DeliveryServiceHandlers,
} from '@ftgo/delivery-service-api';

import { DeliveryRepository } from './delivery.repository';

@restate.service<DeliveryServiceApi>()
export class DeliveryService implements DeliveryServiceHandlers {
  constructor(private readonly delivery: DeliveryRepository) {}

  @restate.handler()
  async create(
    orderId: UUID,
    customerId: UUID,
    restaurantId: UUID,
    deliveryInformation: DeliveryInformation,
    courierAssignmentAwakeableId: string,
  ): Promise<DeliveryCreated> {
    const delivery = await this.delivery.create(
      orderId,
      customerId,
      restaurantId,
      deliveryInformation,
      courierAssignmentAwakeableId,
    );
    // TODO: find and assign courier to delivery
    return new DeliveryCreated(delivery.id);
  }
}
