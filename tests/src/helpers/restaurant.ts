import { faker } from '@faker-js/faker';

import { Money } from '@ftgo/common';

import { client } from '../clients';
import { restaurant } from '../services';

export async function createRestaurant() {
  return await client.rpc(
    restaurant.create(
      faker.company.name(),
      {
        street1: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
      },
      {
        items: [
          {
            name: faker.food.dish(),
            price: new Money(
              parseFloat(
                faker.commerce.price({
                  min: 1,
                  max: 15,
                }),
              ),
            ),
          },
        ],
      },
    ),
  );
}
