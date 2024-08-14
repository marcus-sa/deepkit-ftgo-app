import { restate } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { RestaurantCreatedEvent } from '@ftgo/restaurant-service-api';
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
  @(restate.event<RestaurantCreatedEvent>().handler())
  async createMenu({ restaurant }: RestaurantCreatedEvent): Promise<void> {}

  // @ts-ignore
  @(restate.event<RestaurantCreatedEvent>().handler())
  async reviseMenu({ restaurant }: RestaurantCreatedEvent): Promise<void> {}

  @restate.handler()
  async cancel(id: UUID): Promise<Order> {}

  @restate.handler()
  async get(id: UUID): Promise<Order> {
    return await this.order.find({ id });
  }

  @restate.handler()
  async approve(id: UUID): Promise<Order> {
    return Promise.resolve(undefined);
  }

  @restate.handler()
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

  @restate.handler()
  async undoCancel(id: UUID): Promise<Order> {
    return Promise.resolve(undefined);
  }

  @restate.handler()
  async confirmCancel(id: UUID): Promise<Order> {
    return Promise.resolve(undefined);
  }

  @restate.handler()
  async undoBeginCancel(id: UUID): Promise<Order> {
    return Promise.resolve(undefined);
  }

  @restate.handler()
  create(request: CreateOrderRequest): Promise<Order> {
    return Promise.resolve(undefined);
  }
}
