import { restate } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { RestaurantCreatedEvent } from '@ftgo/restaurant-service-api';
import {
  CreateOrderRequest,
  Order,
  OrderNotFound,
  OrderServiceApi,
  OrderServiceHandlers,
} from '@ftgo/order-service-api';

import { OrderRepository } from './order.repository';

@restate.service<OrderServiceApi>()
export class OrderService implements OrderServiceHandlers {
  constructor(private readonly order: OrderRepository) {}

  @(restate.event<RestaurantCreatedEvent>().handler())
  async createMenu({ restaurant }: RestaurantCreatedEvent): Promise<void> {}

  @(restate.event<RestaurantCreatedEvent>().handler())
  async reviseMenu({ restaurant }: RestaurantCreatedEvent): Promise<void> {}

  @restate.handler()
  async cancel(id: UUID): Promise<Order> {}

  @restate.handler()
  async get(id: UUID): Promise<Order> {
    const order = await this.order.find({ id });
    if (!order) {
      throw new OrderNotFound(id);
    }
    return order;
  }

  @restate.handler()
  async approve(id: UUID): Promise<Order> {}

  @restate.handler()
  async reject(id: UUID): Promise<Order> {}

  @restate.handler()
  async beginCancel(id: UUID): Promise<Order> {
    const order = await this.order.find({ id });
    if (!order) {
      throw new OrderNotFound(id);
    }
    order.cancel();
    await this.order.persist(order);
    return order;
  }

  @restate.handler()
  async undoCancel(id: UUID): Promise<Order> {}

  @restate.handler()
  async confirmCancel(id: UUID): Promise<Order> {}

  @restate.handler()
  async undoBeginCancel(id: UUID): Promise<Order> {}

  @restate.handler()
  async create(request: CreateOrderRequest): Promise<Order> {}
}
