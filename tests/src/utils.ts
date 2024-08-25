import { faker } from '@faker-js/faker';

import { customer } from './services';
import { client } from './clients';

export async function createCustomer() {
  return await client.rpc(
    customer.create({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    }),
  );
}

export async function createRestaurant() {}
