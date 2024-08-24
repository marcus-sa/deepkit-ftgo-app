import { UUID } from '@deepkit/type';

import { RestateRepository } from '@ftgo/common';
import {
  StripeCustomer,
  StripeCustomerNotFound,
} from '@ftgo/payment-service-api';

export class StripeCustomerRepository extends RestateRepository<StripeCustomer> {
  /**
   * @throws StripeCustomerNotFound
   */
  async findByCustomerId(customerId: UUID): Promise<StripeCustomer> {
    const stripeCustomer = await this.find({ customerId });
    if (!stripeCustomer) {
      throw new StripeCustomerNotFound(customerId);
    }
    return stripeCustomer;
  }
}
