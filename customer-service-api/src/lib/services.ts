import { RestateService } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { Money, PersonName } from '@ftgo/common';

import { CustomerNotFound, CustomerVerificationFailed } from './replies';

export interface CustomerServiceHandlers {
  create(name: PersonName): Promise<UUID>;
  validateOrder(
    customerId: UUID,
    orderId: UUID,
    orderTotal: Money,
  ): Promise<void>;
}

export type CustomerServiceApi = RestateService<
  'Consumer',
  CustomerServiceHandlers,
  [CustomerNotFound, CustomerVerificationFailed]
>;
