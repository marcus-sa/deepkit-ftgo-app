import { UUID } from '@deepkit/type';
import { RestateSaga } from 'deepkit-restate';

import { Money } from '@ftgo/common';

import { OrderDetails, OrderRevision } from './entities';

export enum CreateOrderSagaState {
  STARTED = 'STARTED',
  CUSTOMER_VALIDATED = 'CUSTOMER_VALIDATED',
  PAYMENT_AUTHORIZED = 'PAYMENT_AUTHORIZED',
  WAITING_FOR_CONFIRMATION = 'WAITING_FOR_CONFIRMATION',
  REJECTED = 'REJECTED',
  CONFIRMED = 'CONFIRMED',
  APPROVED = 'APPROVED',
}

export class CreateOrderSagaData {
  readonly state?: CreateOrderSagaState = CreateOrderSagaState.STARTED;
  readonly orderId: UUID;
  readonly orderDetails: OrderDetails;
  readonly paymentId?: UUID;
  readonly ticketId?: UUID;
}

export type CreateOrderSagaApi = RestateSaga<
  'CreateOrder',
  CreateOrderSagaData
>;

export class CancelOrderSagaData {
  readonly orderId: UUID;
  readonly reverseRequestId: UUID;
  readonly restaurantId: UUID;
  readonly customerId: UUID;
  readonly orderTotal: Money;
}

export type CancelOrderSagaApi = RestateSaga<
  'CancelOrder',
  CancelOrderSagaData
>;

export class ReviseOrderSagaData {
  readonly orderRevision: OrderRevision;
  readonly orderId: UUID;
  readonly expectedVersion: UUID;
  readonly restaurantId: UUID;
  readonly revisedOrderTotal: Money;
  readonly customerId: UUID;
}

export type ReviseOrderSagaApi = RestateSaga<
  'ReviseOrder',
  ReviseOrderSagaData
>;
