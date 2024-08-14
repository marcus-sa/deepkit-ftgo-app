import { RestateService } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { Money, PersonName } from '@ftgo/common';

import { ConsumerNotFound, ConsumerVerificationFailed } from './replies';

export interface ConsumerServiceHandlers {
  create(name: PersonName): Promise<UUID>;
  validateOrder(
    consumerId: UUID,
    orderId: UUID,
    orderTotal: Money,
  ): Promise<void>;
}

export type ConsumerServiceApi = RestateService<
  'Consumer',
  ConsumerServiceHandlers,
  [ConsumerNotFound, ConsumerVerificationFailed]
>;
