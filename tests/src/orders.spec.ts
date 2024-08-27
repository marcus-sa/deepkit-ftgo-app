import { beforeEach, describe, test } from 'vitest';
import { UUID, uuid } from '@deepkit/type';
import { faker } from '@faker-js/faker';
import { sleep } from '@deepkit/core';

import { Money } from '@ftgo/common';
import { CreateOrderSagaApi, OrderDetails } from '@ftgo/order-service-api';

import { client } from './clients';
import * as helpers from './helpers';

const createOrderSaga = client.saga<CreateOrderSagaApi>();

describe('create order', () => {
  let customerId: UUID;
  let restaurantId: UUID;

  beforeEach(async () => {
    customerId = await helpers.createCustomer();
    restaurantId = await helpers.createRestaurant();
  });

  describe('given order has been validated', () => {
    describe('then authorize payment');

    describe('and payment has been authorized', () => {
      describe('then create ticket', () => {});
    });
  });

  describe('when order fails to be validated', () => {});

  describe('when payment fails to be authorized', () => {});

  test('order fails to be validated', async () => {
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

    const status = await createOrderSaga.start(orderId, {
      orderId,
      orderDetails,
    });

    console.log({ status });

    await sleep(5);

    const state = await createOrderSaga.state(orderId);

    console.log({ state });
  }, 10_000);

  test('payment fails to be authorized', async () => {});
});
