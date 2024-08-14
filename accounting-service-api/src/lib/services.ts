import { RestateService } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { ConsumerCreatedEvent } from '@ftgo/consumer-service-api';
import { Money } from '@ftgo/common';

import { AccountAuthorized, AccountDisabled } from './replies';

export interface AccountingServiceHandlers {
  createAccount(event: ConsumerCreatedEvent): Promise<void>;
  authorize(
    consumerId: UUID,
    orderId: UUID,
    orderTotal: Money,
  ): Promise<AccountAuthorized>;
  reverseAuthorization(
    consumerId: UUID,
    orderId: UUID,
    orderTotal: Money,
  ): Promise<unknown>;
  // disable(id: UUID): Promise<Account>;
  // enable(id: UUID): Promise<Account>;
}

export type AccountingServiceApi = RestateService<
  'Accounting',
  AccountingServiceHandlers,
  [AccountDisabled]
>;
