import { RestateRepository } from '@ftgo/common';
import { OrderNotFound } from '@ftgo/order-service-api';

import { Order } from './entities';

export class OrderRepository extends RestateRepository<Order> {
  /**
   * @throws OrderNotFound
   */
  async findById(id: Order['id']): Promise<Order> {
    const order = await this.find({ id });
    if (!order) {
      throw new OrderNotFound(id);
    }
    return order;
  }
}
