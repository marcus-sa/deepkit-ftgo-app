import { RestateKafkaTopic } from 'deepkit-restate';

import { Consumer } from './entities';

export type KafkaConsumerTopic = RestateKafkaTopic<
  'consumer',
  [consumer: Consumer]
>;
