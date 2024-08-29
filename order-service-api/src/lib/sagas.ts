import { UUID } from '@deepkit/type';
import { RestateSaga } from 'deepkit-restate';

import { Money } from '@ftgo/common';

import { OrderDetails, OrderRevision } from './entities';

export enum CreateOrderSagaState {
  STARTED = 'STARTED',
  CUSTOMER_VALIDATED = 'CUSTOMER_VALIDATED',
  CUSTOMER_VALIDATION_FAILED = 'CUSTOMER_VALIDATION_FAILED',
  PAYMENT_AUTHORIZED = 'PAYMENT_AUTHORIZED',
  PAYMENT_AUTHORIZATION_FAILED = 'PAYMENT_AUTHORIZATION_FAILED',
  WAITING_FOR_TICKET_CONFIRMATION = 'WAITING_FOR_TICKET_CONFIRMATION',
  WAITING_FOR_COURIER_ASSIGNMENT = 'WAITING_FOR_COURIER_ASSIGNMENT',
  DELIVERY_CREATED = 'DELIVERY_CREATED',
  REJECTED = 'REJECTED',
  TICKET_REJECTED = 'TICKET_REJECTED',
  TICKET_CANCELLED = 'TICKET_CANCELLED',
  TICKET_CONFIRMED = 'TICKET_CONFIRMED',
  APPROVED = 'APPROVED',
}

export type CreateOrderSagaRejectedState = Extract<
  CreateOrderSagaState,
  | CreateOrderSagaState.CUSTOMER_VALIDATION_FAILED
  | CreateOrderSagaState.PAYMENT_AUTHORIZATION_FAILED
  | CreateOrderSagaState.TICKET_REJECTED
>;

export class CreateOrderSagaData {
  readonly state?: CreateOrderSagaState = CreateOrderSagaState.STARTED;
  readonly rejectedState?: CreateOrderSagaRejectedState;
  readonly orderId: UUID;
  readonly orderDetails: OrderDetails;
  readonly paymentId?: UUID;
  readonly ticketId?: UUID;
  readonly deliveryId?: UUID;
  readonly courierId?: UUID;
}

export type CreateOrderSagaApi = RestateSaga<
  'CreateOrder',
  CreateOrderSagaData
>;

export class CancelOrderSagaData {
  readonly orderId: UUID;
  readonly restaurantId: UUID;
  readonly customerId: UUID;
  readonly paymentId?: UUID;
  readonly ticketId?: UUID;
  readonly reverseRequestId: UUID;
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
