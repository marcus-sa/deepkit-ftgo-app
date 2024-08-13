import { restate, RestateServiceContext } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { Consumer, KafkaConsumerTopic } from '@ftgo/consumer-service-api';
import { Money } from '@ftgo/common';
import {
  Account,
  AccountingServiceApi,
  AccountingServiceHandlers,
} from '@ftgo/accounting-service-api';

import { AccountRepository } from './account.repository';

@restate.service<AccountingServiceApi>()
export class AccountingService implements AccountingServiceHandlers {
  constructor(private readonly account: AccountRepository) {}

  // @ts-ignore
  @(restate.kafka<KafkaConsumerTopic>().handler())
  async createAccount(consumer: Consumer): Promise<void> {
    await this.account.create(consumer.id);
  }

  @restate.handler()
  async authorize(
    consumerId: UUID,
    orderId: UUID,
    orderTotal: Money,
  ): Promise<unknown> {}
}
