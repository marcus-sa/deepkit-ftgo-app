import { beforeEach, describe, test } from 'vitest';
import { UUID, uuid } from '@deepkit/type';
import { faker } from '@faker-js/faker';

import {
  CreateOrderSagaApi,
  OrderDetails,
  OrderLineItem,
  OrderLineItems,
} from '@ftgo/order-service-api';
import { Money } from '@ftgo/common';

import { client } from './clients';
import { createCustomer, createRestaurant } from './utils';

const createOrderSaga = client.saga<CreateOrderSagaApi>();

describe('create order', () => {
  let customerId: UUID;
  let restaurantId: UUID;

  beforeEach(async () => {
    customerId = await createCustomer();
    restaurantId = await createRestaurant();
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
        OrderLineItem.create({
          quantity: 1,
          menuItemId: uuid(),
          name: faker.food.dish(),
          price: new Money(10),
        }),
      ],
      orderTotal: new Money(10),
    };

    const status = await createOrderSaga.start(orderId, {
      orderId,
      orderDetails,
    });
  });

  test('payment fails to be authorized', async () => {});
});
