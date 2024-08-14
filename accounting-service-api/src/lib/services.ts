import { RestateService } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { Money } from '@ftgo/common';

export interface AccountingServiceHandlers {
  createAccount(consumerId: UUID): Promise<void>;
  authorize(
    consumerId: UUID,
    orderId: UUID,
    orderTotal: Money,
  ): Promise<unknown>;
  reverseAuthorization(
    consumerId: UUID,
    orderId: UUID,
    orderTotal: Money,
  ): Promise<unknown>;
}

export type AccountingServiceApi = RestateService<
  'Accounting',
  AccountingServiceHandlers
>;
