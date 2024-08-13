import { RestateService } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { Money, PersonName } from '@ftgo/common';

export interface ConsumerServiceHandlers {
  create(name: PersonName): Promise<UUID>;
  validateOrder(
    consumerId: UUID,
    orderId: UUID,
    orderTotal: Money,
  ): Promise<any>;
}

export type ConsumerServiceApi = RestateService<
  'Consumer',
  ConsumerServiceHandlers
>;
