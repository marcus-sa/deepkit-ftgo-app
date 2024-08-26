import { RestateRepository } from '@ftgo/common';
import { CustomerNotFound } from '@ftgo/customer-service-api';

import { Customer } from './entities';

export class CustomerRepository extends RestateRepository<Customer> {
  /**
   * @throws CustomerNotFound
   */
  async findById(id: Customer['id']): Promise<Customer> {
    const customer = await this.find({ id });
    if (!customer) {
      throw new CustomerNotFound(id);
    }
    return customer;
  }
}
