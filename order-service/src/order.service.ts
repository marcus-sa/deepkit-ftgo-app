import { restate } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { RestaurantCreatedEvent } from '@ftgo/restaurant-service-api';
import {
  OrderApproved,
  OrderCreated,
  OrderDetails,
  OrderRejected,
  OrderServiceApi,
  OrderServiceHandlers,
} from '@ftgo/order-service-api';

import { OrderRepository } from './order.repository';

@restate.service<OrderServiceApi>()
export class OrderService implements OrderServiceHandlers {
  constructor(private readonly order: OrderRepository) {}

  // @ts-expect-error invalid number of arguments
  @(restate.event<RestaurantCreatedEvent>().handler())
  async createMenu({ restaurantId }: RestaurantCreatedEvent): Promise<void> {}

  // @ts-expect-error invalid number of arguments
  @(restate.event<RestaurantCreatedEvent>().handler())
  async reviseMenu({ restaurantId }: RestaurantCreatedEvent): Promise<void> {}

  @restate.handler()
  async cancel(id: UUID): Promise<void> {
    throw new Error('Not yet implemented');
  }

  @restate.handler()
  async approve(id: UUID): Promise<OrderApproved> {
    const order = await this.order.findById(id);
    const orderApproved = order.approve();
    await this.order.save(order);
    return orderApproved;
  }

  @restate.handler()
  async reject(id: UUID): Promise<OrderRejected> {
    const order = await this.order.findById(id);
    const orderRejected = order.reject();
    await this.order.save(order);
    return orderRejected;
  }

  @restate.handler()
  async beginCancel(id: UUID): Promise<void> {
    const order = await this.order.findById(id);
    order.cancel();
    await this.order.save(order);
  }

  @restate.handler()
  async undoCancel(id: UUID): Promise<void> {
    throw new Error('Not yet implemented');
  }

  @restate.handler()
  async confirmCancel(id: UUID): Promise<void> {
    throw new Error('Not yet implemented');
  }

  @restate.handler()
  async undoBeginCancel(id: UUID): Promise<void> {
    throw new Error('Not yet implemented');
  }

  @restate.handler()
  async create(
    orderId: UUID,
    { customerId, restaurantId, lineItems }: OrderDetails,
  ): Promise<OrderCreated> {
    const order = await this.order.create(
      orderId,
      customerId,
      restaurantId,
      lineItems,
    );
    return new OrderCreated(order.id);
  }
}
