import { RestateService } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { PersonName } from '@ftgo/common';

import {
  CourierCreated,
  CourierDeliveryAssigned,
  CourierUnavailable,
} from './replies';

export interface CourierServiceHandlers {
  create(name: PersonName): Promise<CourierCreated>;
  /**
   * @throws CourierUnavailable
   */
  findAvailableCourierAndAssignToDelivery(
    deliveryId: UUID,
    awakeableId: string,
  ): Promise<CourierDeliveryAssigned>;
}

export type CourierServiceApi = RestateService<
  'Courier',
  CourierServiceHandlers
>;
