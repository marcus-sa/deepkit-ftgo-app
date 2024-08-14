import { restate } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { ConsumerCreatedEvent } from '@ftgo/consumer-service-api';
import { Money } from '@ftgo/common';
import {
  AccountAuthorized,
  AccountingServiceApi,
  AccountingServiceHandlers,
} from '@ftgo/accounting-service-api';

import { AccountRepository } from './account.repository';

@restate.service<AccountingServiceApi>()
export class AccountingService implements AccountingServiceHandlers {
  constructor(private readonly account: AccountRepository) {}

  // @ts-ignore
  @(restate.event<ConsumerCreatedEvent>().handler())
  async createAccount({ consumer }: ConsumerCreatedEvent): Promise<void> {
    await this.account.create(consumer.id);
  }

  @restate.handler()
  async authorize(
    consumerId: UUID,
    orderId: UUID,
    orderTotal: Money,
  ): Promise<AccountAuthorized> {
    const account = await this.account.findByConsumer(consumerId);
    account.assertEnabled();
    return new AccountAuthorized(account.id);
  }

  @restate.handler()
  async reverseAuthorization(
    consumerId: UUID,
    orderId: UUID,
    orderTotal: Money,
  ): Promise<void> {
    const account = await this.account.findByConsumer(consumerId);
    account.assertEnabled();
  }

  // @restate.handler()
  // async disable(id: UUID): Promise<Account> {
  //   return Promise.resolve(undefined);
  // }
  //
  // @restate.handler()
  // async enable(id: UUID): Promise<Account> {
  //   return Promise.resolve(undefined);
  // }
}
