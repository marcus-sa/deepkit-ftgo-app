import { restate, RestateServiceContext } from 'deepkit-restate';

import {
  KafkaRestaurantMenuRevisedTopic,
  KafkaRestaurantCreatedTopic,
  Restaurant,
  RestaurantMenu,
} from '@ftgo/restaurant-service-api';
import {
  Kitchen,
  KitchenServiceApi,
  KitchenServiceHandlers,
} from '@ftgo/kitchen-service-api';

@restate.service<KitchenServiceApi>()
export class KitchenService implements KitchenServiceHandlers {
  // @ts-ignore
  @(restate.kafka<KafkaRestaurantCreatedTopic>().handler())
  async createMenu(restaurant: Restaurant): Promise<void> {}

  // @ts-ignore
  @(restate.kafka<KafkaRestaurantMenuRevisedTopic>().handler())
  async reviseMenu(menu: RestaurantMenu): Promise<void> {}
}
