import { restate } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import {
  KafkaRestaurantCreatedTopic,
  KafkaRestaurantMenuRevisedTopic,
  Restaurant,
  RestaurantMenu,
} from '@ftgo/restaurant-service-api';
import {
  CreateOrderRequest,
  Order,
  OrderServiceApi,
  OrderServiceHandlers,
} from '@ftgo/order-service-api';

import { OrderRepository } from './order.repository';

@restate.service<OrderServiceApi>()
export class OrderService implements OrderServiceHandlers {
  constructor(private readonly order: OrderRepository) {}

  // @ts-ignore
  @(restate.kafka<KafkaRestaurantCreatedTopic>().handler())
  async createMenu(restaurant: Restaurant): Promise<void> {}

  // @ts-ignore
  @(restate.kafka<KafkaRestaurantMenuRevisedTopic>().handler())
  async reviseMenu(menu: RestaurantMenu): Promise<void> {}

  @restate.handler()
  async create(request: CreateOrderRequest) {}

  @restate.handler()
  async cancel(id: UUID): Promise<Order> {}

  @restate.handler()
  async get(id: UUID): Promise<Order> {
    return await this.order.find({ id });
  }

  async approve(id: UUID): Promise<Order> {
    return Promise.resolve(undefined);
  }

  async reject(id: UUID): Promise<Order> {
    return Promise.resolve(undefined);
  }

  @restate.handler()
  async beginCancel(id: UUID): Promise<Order> {
    const order = await this.order.find({ id });
    order.cancel();
    await this.order.persist(order);
    return order;
  }

  undoCancel(id: UUID): Promise<Order> {
    return Promise.resolve(undefined);
  }
}
