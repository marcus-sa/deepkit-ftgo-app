import { restate, RestateServiceContext } from 'deepkit-restate';

import {
  AccountingServiceApi,
  AccountingServiceHandlers,
} from '@ftgo/accounting-service-api';
import { Consumer, KafkaConsumerTopic } from '@ftgo/consumer-service-api';

import { AccountRepository } from './account.repository';

@restate.service<AccountingServiceApi>()
export class AccountingService implements AccountingServiceHandlers {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly ctx: RestateServiceContext,
  ) {}

  // @ts-ignore
  @(restate.kafka<KafkaConsumerTopic>().handler())
  async createAccount(consumer: Consumer): Promise<void> {
    await this.ctx.run(() =>
      this.accountRepository.create({ consumerId: consumer.id }),
    );
  }
}
