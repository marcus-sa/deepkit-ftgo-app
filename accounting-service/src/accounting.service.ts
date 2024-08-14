import { restate } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { Consumer } from '@ftgo/consumer-service-api';
import { Money } from '@ftgo/common';
import {
  AccountingServiceApi,
  AccountingServiceHandlers,
} from '@ftgo/accounting-service-api';

import { AccountRepository } from './account.repository';

@restate.service<AccountingServiceApi>()
export class AccountingService implements AccountingServiceHandlers {
  constructor(private readonly account: AccountRepository) {}

  @restate.handler()
  async createAccount(consumerId: UUID): Promise<void> {
    await this.account.create(consumerId);
  }

  @restate.handler()
  async authorize(
    consumerId: UUID,
    orderId: UUID,
    orderTotal: Money,
  ): Promise<unknown> {}

  @restate.handler()
  async reverseAuthorization(
    consumerId: UUID,
    orderId: UUID,
    orderTotal: Money,
  ): Promise<unknown> {
    return Promise.resolve(undefined);
  }
}
