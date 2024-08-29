import { RestateService } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { DeliveryInformation } from './types';
import { DeliveryCreated } from './replies';

export interface DeliveryServiceHandlers {
  /**
   * @throws DeliveryCourierUnavailable
   */
  create(
    orderId: UUID,
    customerId: UUID,
    restaurantId: UUID,
    deliveryInformation: DeliveryInformation,
    courierAssignmentAwakeableId: string,
  ): Promise<DeliveryCreated>;
}

export type DeliveryServiceApi = RestateService<
  'Delivery',
  DeliveryServiceHandlers
>;
