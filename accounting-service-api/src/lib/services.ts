import { RestateService } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { Consumer } from '@ftgo/consumer-service-api';
import { Money } from '@ftgo/common';

export interface AccountingServiceHandlers {
  // Only required for handlers that need to be invoked directly using a Restate client
  createAccount(consumer: Consumer): Promise<void>;
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
