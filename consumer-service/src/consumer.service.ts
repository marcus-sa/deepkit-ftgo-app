import { restate, RestateServiceContext } from 'deepkit-restate';
import { RestateKafkaProducer } from 'deepkit-restate/kafka';
import { UUID } from '@deepkit/type';

import { PersonName } from '@ftgo/common';
import {
  Consumer,
  ConsumerServiceApi,
  ConsumerServiceHandlers,
  KafkaConsumerTopic,
} from '@ftgo/consumer-service-api';

import { ConsumerRepository } from './consumer.repository';

@restate.service<ConsumerServiceApi>()
export class ConsumerService implements ConsumerServiceHandlers {
  constructor(
    private readonly consumer: ConsumerRepository,
    private readonly kafka: RestateKafkaProducer,
  ) {}

  @restate.handler()
  async create(name: PersonName): Promise<UUID> {
    const consumer = (await this.consumer.create({ name })) as Consumer;
    await this.kafka.produce<KafkaConsumerTopic>([consumer]);
    return consumer.id;
  }
}
