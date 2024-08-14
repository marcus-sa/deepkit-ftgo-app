import { restate, RestateEventPublisher } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { Money, PersonName } from '@ftgo/common';
import {
  Consumer,
  ConsumerCreatedEvent,
  ConsumerNotFound,
  ConsumerServiceApi,
  ConsumerServiceHandlers,
  ConsumerVerificationFailed,
} from '@ftgo/consumer-service-api';

import { ConsumerRepository } from './consumer.repository';

@restate.service<ConsumerServiceApi>()
export class ConsumerService implements ConsumerServiceHandlers {
  constructor(
    private readonly consumer: ConsumerRepository,
    private readonly events: RestateEventPublisher,
  ) {}

  @restate.handler()
  async create(name: PersonName): Promise<UUID> {
    const consumer = await this.consumer.create(name);
    await this.events.publish([new ConsumerCreatedEvent(consumer)]);
    return consumer.id;
  }

  @restate.handler()
  async validateOrder(
    consumerId: UUID,
    orderId: UUID,
    orderTotal: Money,
  ): Promise<void> {
    const consumer = await this.consumer.find({ id: consumerId });
    if (!consumer) {
      throw new ConsumerNotFound(consumerId);
    }
    // TODO: validation
    throw new ConsumerVerificationFailed(consumerId);
  }
}
