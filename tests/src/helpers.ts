import { faker } from '@faker-js/faker';
import { uuid } from '@deepkit/type';

import { OrderLineItem, OrderLineItems } from '@ftgo/order-service-api';
import { Money } from '@ftgo/common';

export function createOrderLineItem(): OrderLineItem {
  return OrderLineItem.create({
    quantity: faker.number.int({ min: 1, max: 3 }),
    menuItemId: uuid(),
    name: faker.food.dish(),
    price: new Money(
      parseFloat(
        faker.commerce.price({
          min: 1,
          max: 15,
        }),
      ),
    ),
  });
}
