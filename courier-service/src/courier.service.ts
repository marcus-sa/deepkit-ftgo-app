import { restate } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { PersonName } from '@ftgo/common';
import {
  CourierCreated,
  CourierDeliveryAssigned,
  CourierInformation,
  CourierServiceApi,
  CourierServiceHandlers,
} from '@ftgo/courier-service-api';

import { CourierRepository } from './courier.repository';

@restate.service<CourierServiceApi>()
export class CourierService implements CourierServiceHandlers {
  constructor(private readonly courier: CourierRepository) {}

  @restate.handler()
  async create(name: PersonName): Promise<CourierCreated> {
    const courier = await this.courier.create(name);
    // TODO: find and assign courier to courier
    return new CourierCreated(courier.id);
  }

  @restate.handler()
  async findAvailableCourierAndAssignToDelivery(
    deliveryId: UUID,
    awakeableId: string,
  ): Promise<CourierDeliveryAssigned> {
    throw new Error('Not yet implemented');
  }
}
