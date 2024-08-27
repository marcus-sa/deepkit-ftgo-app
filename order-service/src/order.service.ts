import { restate } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { RestaurantCreatedEvent } from '@ftgo/restaurant-service-api';
import {
  OrderApproved,
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
    throw new Error('Not yet implemented');
  }

  @restate.handler()
  async reject(id: UUID): Promise<OrderRejected> {
    const order = await this.order.findById(id);
    order.noteRejected();
    await this.order.save(order);
    return new OrderRejected();
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
  ): Promise<UUID> {
    const order = await this.order.create(
      orderId,
      customerId,
      restaurantId,
      lineItems,
    );
    return order.id;
  }
}
