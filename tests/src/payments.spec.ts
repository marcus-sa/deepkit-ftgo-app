import { describe, test } from 'vitest';
import { sleep } from '@deepkit/core';

import * as helpers from './helpers';
import { payment } from './services';
import { client } from './clients';

describe('given a customer has been created in customer service', () => {
  test('then a corresponding customer should be created in payment service', async () => {
    const customerId = await helpers.createCustomer();
    await sleep(1);
    const paymentCustomer = await client.rpc(payment.getCustomer(customerId));
    console.log(paymentCustomer);
  });
});
