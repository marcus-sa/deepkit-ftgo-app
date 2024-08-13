import { restate, RestateServiceContext } from 'deepkit-restate';

import { Consumer, KafkaConsumerTopic } from '@ftgo/consumer-service-api';
import {
  AccountingServiceApi,
  AccountingServiceHandlers,
} from '@ftgo/accounting-service-api';

import { AccountRepository } from './account.repository';

@restate.service<AccountingServiceApi>()
export class AccountingService implements AccountingServiceHandlers {
  constructor(private readonly accountRepository: AccountRepository) {}

  // @ts-ignore
  @(restate.kafka<KafkaConsumerTopic>().handler())
  async createAccount(consumer: Consumer): Promise<void> {
    await this.accountRepository.create({ consumerId: consumer.id });
  }
}
