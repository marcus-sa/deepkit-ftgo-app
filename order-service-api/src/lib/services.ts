import { restate, RestateService } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { Money } from '@ftgo/common';
import {
  Restaurant,
  RestaurantCreatedEvent,
  RestaurantMenu,
} from '@ftgo/restaurant-service-api';

import { Order, OrderDetails } from './entities';
import { CreateOrderRequest } from './dtos';
import {
  OrderApproved,
  OrderMinimumNotMetException,
  OrderNotFound,
  OrderRejected,
} from './replies';

export interface OrderServiceHandlers {
  create(orderId: UUID, details: OrderDetails): Promise<Order>;
  get(id: UUID): Promise<Order>;
  beginCancel(id: UUID): Promise<Order>;
  undoBeginCancel(id: UUID): Promise<Order>;
  undoCancel(id: UUID): Promise<Order>;
  cancel(id: UUID): Promise<Order>;
  confirmCancel(id: UUID): Promise<Order>;
  reject(id: UUID): Promise<OrderRejected>;
  approve(id: UUID): Promise<OrderApproved>;
  createMenu(event: RestaurantCreatedEvent): Promise<void>;
  reviseMenu(event: RestaurantCreatedEvent): Promise<void>;
}

export type OrderServiceApi = RestateService<
  'Order',
  OrderServiceHandlers,
  [OrderNotFound, OrderMinimumNotMetException]
>;
