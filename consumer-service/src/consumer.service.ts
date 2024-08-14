import { restate, RestateServiceContext } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { Money, PersonName } from '@ftgo/common';
import { AccountingServiceApi } from '@ftgo/accounting-service-api';
import {
  Consumer,
  ConsumerServiceApi,
  ConsumerServiceHandlers,
} from '@ftgo/consumer-service-api';

import { ConsumerRepository } from './consumer.repository';

@restate.service<ConsumerServiceApi>()
export class ConsumerService implements ConsumerServiceHandlers {
  constructor(
    private readonly consumer: ConsumerRepository,
    private readonly accounting: AccountingServiceApi,
    private readonly ctx: RestateServiceContext,
  ) {}

  @restate.handler()
  async create(name: PersonName): Promise<UUID> {
    const consumer = (await this.consumer.create(name)) as Consumer;
    await this.ctx.send(this.accounting.createAccount(consumer.id));
    return consumer.id;
  }

  @restate.handler()
  validateOrder(
    consumerId: UUID,
    orderId: UUID,
    orderTotal: Money,
  ): Promise<any> {
    return Promise.resolve(undefined);
  }
}
