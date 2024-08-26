import { faker } from '@faker-js/faker';

import { customer } from '../services';
import { client } from '../clients';

export async function createCustomer() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return await client.rpc(
    customer.create(
      { firstName, lastName },
      faker.internet.email({ firstName, lastName }),
    ),
  );
}
