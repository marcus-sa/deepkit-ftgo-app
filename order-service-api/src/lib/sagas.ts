import { UUID } from '@deepkit/type';
import { RestateSaga } from 'deepkit-restate';

import { Money } from '@ftgo/common';

import { OrderDetails, OrderRevision } from './entities';

export class CreateOrderSagaData {
  readonly orderId: UUID;
  readonly orderDetails: OrderDetails;
  readonly ticketId?: UUID;
}

export type CreateOrderSagaApi = RestateSaga<
  'create-order',
  CreateOrderSagaData
>;

export class CancelOrderSagaData {
  readonly orderId: UUID;
  readonly reverseRequestId: UUID;
  readonly restaurantId: UUID;
  readonly consumerId: UUID;
  readonly orderTotal: Money;
}

export type CancelOrderSagaApi = RestateSaga<
  'cancel-order',
  CancelOrderSagaData
>;

export class ReviseOrderSagaData {
  readonly orderRevision: OrderRevision;
  readonly orderId: UUID;
  readonly expectedVersion: UUID;
  readonly restaurantId: UUID;
  readonly revisedOrderTotal: Money;
  readonly consumerId: UUID;
}

export type ReviseOrderSagaApi = RestateSaga<
  'revise-order',
  ReviseOrderSagaData
>;
