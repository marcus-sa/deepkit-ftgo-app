import { RestateService } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { RestaurantCreatedEvent } from '@ftgo/restaurant-service-api';

import { OrderDetails } from './entities';
import { OrderApproved, OrderCreated, OrderRejected } from './replies';

export interface OrderServiceHandlers {
  create(orderId: UUID, details: OrderDetails): Promise<OrderCreated>;
  beginCancel(id: UUID): Promise<void>;
  undoBeginCancel(id: UUID): Promise<void>;
  undoCancel(id: UUID): Promise<void>;
  cancel(id: UUID): Promise<void>;
  confirmCancel(id: UUID): Promise<void>;
  reject(id: UUID): Promise<OrderRejected>;
  approve(id: UUID): Promise<OrderApproved>;
  createMenu(event: RestaurantCreatedEvent): Promise<void>;
  reviseMenu(event: RestaurantCreatedEvent): Promise<void>;
}

export type OrderServiceApi = RestateService<'Order', OrderServiceHandlers>;
