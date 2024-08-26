import { UUID } from '@deepkit/type';

import { RestateRepository } from '@ftgo/common';
import { PaymentNotFound } from '@ftgo/payment-service-api';

import { Payment } from './entities';

export class PaymentRepository extends RestateRepository<Payment> {
  /**
   * @throws PaymentNotFound
   */
  async findById(id: UUID): Promise<Payment> {
    const payment = await this.find({ id });
    if (!payment) {
      throw new PaymentNotFound(id);
    }
    return payment;
  }
}
