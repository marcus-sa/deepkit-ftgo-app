import { RestateKafkaTopic } from 'deepkit-restate';

import { Restaurant, RestaurantMenu } from './entities.js';

export type KafkaRestaurantCreatedTopic = RestateKafkaTopic<
  'restaurant-created',
  [restaurant: Restaurant]
>;

// export type RestateRestaurantCreatedEvent = RestateEvent<RestaurantCreated>;

export type KafkaRestaurantMenuRevisedTopic = RestateKafkaTopic<
  'restaurant-menu-revised',
  [menu: RestaurantMenu]
>;
