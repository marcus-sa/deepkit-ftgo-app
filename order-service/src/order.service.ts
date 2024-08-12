import { restate, RestateServiceContext } from 'deepkit-restate';

import {
  KafkaRestaurantCreatedTopic,
  KafkaRestaurantMenuRevisedTopic,
  Restaurant,
  RestaurantMenu,
} from '@ftgo/restaurant-service-api';
import {
  Order,
  OrderServiceApi,
  OrderServiceHandlers,
} from '@ftgo/order-service-api';

@restate.service<OrderServiceApi>()
export class OrderService implements OrderServiceHandlers {
  constructor(private readonly ctx: RestateServiceContext) {}

  // @ts-ignore
  @(restate.kafka<KafkaRestaurantCreatedTopic>().handler())
  async createMenu(restaurant: Restaurant): Promise<void> {}

  // @ts-ignore
  @(restate.kafka<KafkaRestaurantMenuRevisedTopic>().handler())
  async reviseMenu(menu: RestaurantMenu): Promise<void> {}
}
