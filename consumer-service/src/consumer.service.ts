import { restate, RestateServiceContext } from 'deepkit-restate';
import { RestateKafkaProducer } from 'deepkit-restate/kafka';
import { UUID } from '@deepkit/type';

import {
  Consumer,
  ConsumerServiceApi,
  ConsumerServiceHandlers,
  KafkaConsumerTopic,
} from '@ftgo/consumer-service-api';
import { PersonName } from '@ftgo/common';

import { ConsumerRepository } from './consumer.repository';

@restate.service<ConsumerServiceApi>()
export class ConsumerService implements ConsumerServiceHandlers {
  constructor(
    private readonly ctx: RestateServiceContext,
    private readonly consumer: ConsumerRepository,
    private readonly kafka: RestateKafkaProducer,
  ) {}

  @restate.handler()
  async create(name: PersonName): Promise<UUID> {
    const consumer = await this.ctx.run<Consumer>(() =>
      this.consumer.create({ name }),
    );
    await this.kafka.produce<KafkaConsumerTopic>([consumer]);
  }
}
