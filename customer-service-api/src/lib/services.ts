import { RestateService } from 'deepkit-restate';
import { Email, UUID } from '@deepkit/type';

import { Money, PersonName } from '@ftgo/common';

import { CustomerOrderValidated } from './replies';

export interface CustomerServiceHandlers {
  create(name: PersonName, email: Email): Promise<UUID>;
  /**
   * @throws CustomerOrderValidationFailed
   */
  validateOrder(
    customerId: UUID,
    orderId: UUID,
    orderTotal: Money,
  ): Promise<CustomerOrderValidated>;
}

export type CustomerServiceApi = RestateService<
  'Customer',
  CustomerServiceHandlers
>;
