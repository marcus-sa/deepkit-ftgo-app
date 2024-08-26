import { UUID } from '@deepkit/type';

import { RestateRepository } from '@ftgo/common';
import {
  PaymentCustomer,
  PaymentCustomerNotFound,
} from '@ftgo/payment-service-api';

export class CustomerRepository extends RestateRepository<PaymentCustomer> {
  /**
   * @throws PaymentCustomerNotFound
   */
  async findByCustomerId(customerId: UUID): Promise<PaymentCustomer> {
    const stripeCustomer = await this.find({ customerId });
    if (!stripeCustomer) {
      throw new PaymentCustomerNotFound(customerId);
    }
    return stripeCustomer;
  }
}
