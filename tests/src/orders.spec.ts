import { beforeEach, describe, test, expect, vi } from 'vitest';
import { UUID, uuid } from '@deepkit/type';
import { faker } from '@faker-js/faker';
import { sleep } from '@deepkit/core';

import { TicketCreated } from '@ftgo/kitchen-service-api';
import { Money } from '@ftgo/common';
import {
  CreateOrderSagaApi,
  CreateOrderSagaState,
  OrderDetails,
} from '@ftgo/order-service-api';

import { client } from './clients';
import * as helpers from './helpers';
import * as rpc from './rpc';
import { kitchen } from './services';

const createOrderSaga = client.saga<CreateOrderSagaApi>();

describe('create order', () => {
  let customerId: UUID;
  let restaurantId: UUID;

  beforeEach(async () => {
    customerId = await helpers.createCustomer();
    restaurantId = await helpers.createRestaurant();
    await sleep(1);
  });

  describe('given order has been validated', () => {
    describe('then authorize payment');

    describe('and payment has been authorized', () => {
      describe('then create ticket', () => {});
    });
  });

  describe('when order fails to be validated', () => {});

  describe('when payment fails to be authorized', () => {});

  test('order creation failed because ticket was rejected', async () => {
    const orderId = uuid();

    const orderDetails: OrderDetails = {
      customerId,
      restaurantId,
      lineItems: [
        {
          quantity: 1,
          name: faker.food.dish(),
          price: new Money(10),
        },
      ],
      orderTotal: new Money(10),
    };

    const createdTickets = await rpc.kitchen.createdTickets();

    const handleCreatedTickets = vi.fn(async ({ ticketId }: TicketCreated) => {
      {
        const state = await createOrderSaga.state(orderId);
        expect(state.sagaData.state).toBe(
          CreateOrderSagaState.PAYMENT_AUTHORIZED,
        );
      }
      await sleep(1);
      {
        const state = await createOrderSaga.state(orderId);
        expect(state.sagaData.state).toBe(
          CreateOrderSagaState.WAITING_FOR_CONFIRMATION,
        );
      }
      await rpc.kitchen.rejectTicket(ticketId, 'Missing ingredients');
    });

    createdTickets.subscribe(handleCreatedTickets);

    const { status } = await createOrderSaga.start(orderId, {
      orderId,
      orderDetails,
    });

    expect(status).toBe('Accepted');

    await sleep(3);

    expect(handleCreatedTickets).toHaveBeenCalledTimes(1);

    const state = await createOrderSaga.state(orderId);
    expect(state.sagaData.state).toBe(CreateOrderSagaState.REJECTED);
  });

  test('order creation was successful', async () => {
    const orderId = uuid();

    const orderDetails: OrderDetails = {
      customerId,
      restaurantId,
      lineItems: [
        {
          quantity: 1,
          name: faker.food.dish(),
          price: new Money(10),
        },
      ],
      orderTotal: new Money(10),
    };

    const createdTickets = await rpc.kitchen.createdTickets();

    const handleCreatedTickets = vi.fn(async ({ ticketId }: TicketCreated) => {
      {
        const state = await createOrderSaga.state(orderId);
        expect(state.sagaData.state).toBe(
          CreateOrderSagaState.PAYMENT_AUTHORIZED,
        );
      }
      await sleep(1);
      {
        const state = await createOrderSaga.state(orderId);
        expect(state.sagaData.state).toBe(
          CreateOrderSagaState.WAITING_FOR_CONFIRMATION,
        );
      }
      await rpc.kitchen.confirmTicket(ticketId, new Date());
    });

    createdTickets.subscribe(handleCreatedTickets);

    const { status } = await createOrderSaga.start(orderId, {
      orderId,
      orderDetails,
    });

    expect(status).toBe('Accepted');

    await sleep(4);

    expect(handleCreatedTickets).toHaveBeenCalledTimes(1);

    const state = await createOrderSaga.state(orderId);
    expect(state.sagaData.state).toBe(CreateOrderSagaState.APPROVED);
  });

  test('payment fails to be authorized', async () => {});
});
