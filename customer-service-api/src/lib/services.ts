import { RestateService } from 'deepkit-restate';
import { Email, UUID } from '@deepkit/type';

import { Money, PersonName } from '@ftgo/common';

import { CustomerNotFound, CustomerVerificationFailed } from './replies';

export interface CustomerServiceHandlers {
  create(name: PersonName, email: Email): Promise<UUID>;
  validateOrder(
    customerId: UUID,
    orderId: UUID,
    orderTotal: Money,
  ): Promise<void>;
}

export type CustomerServiceApi = RestateService<
  'Customer',
  CustomerServiceHandlers,
  [CustomerNotFound, CustomerVerificationFailed]
>;
