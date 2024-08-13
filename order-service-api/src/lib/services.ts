import { RestateService } from 'deepkit-restate';
import { UUID } from '@deepkit/type';
import { ItemNotFound } from '@deepkit/orm';

import { Order } from './entities';
import { CreateOrderRequest } from './dtos';
import { OrderMinimumNotMetException } from './replies';

export interface OrderServiceHandlers {
  create(request: CreateOrderRequest): Promise<Order>;
  get(id: UUID): Promise<Order>;
  beginCancel(id: UUID): Promise<Order>;
  undoBeginCancel(id: UUID): Promise<Order>;
  undoCancel(id: UUID): Promise<Order>;
  cancel(id: UUID): Promise<Order>;
  confirmCancel(id: UUID): Promise<Order>;
  reject(id: UUID): Promise<Order>;
  approve(id: UUID): Promise<Order>;
}

export type OrderServiceApi = RestateService<
  'Order',
  OrderServiceHandlers,
  [ItemNotFound, OrderMinimumNotMetException]
>;
