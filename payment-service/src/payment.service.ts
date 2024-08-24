import { restate } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { CustomerCreatedEvent } from '@ftgo/customer-service-api';
import { Money } from '@ftgo/common';
import {
  PaymentReserved,
  PaymentServiceApi,
  PaymentServiceHandlers,
} from '@ftgo/payment-service-api';

import { PaymentRepository } from './payment.repository';

@restate.service<PaymentServiceApi>()
export class PaymentService implements PaymentServiceHandlers {
  constructor(private readonly payment: PaymentRepository) {}

  @(restate.event<CustomerCreatedEvent>().handler())
  async createCustomer({ customer }: CustomerCreatedEvent): Promise<void> {}

  @restate.handler()
  async reserve(
    customerId: UUID,
    orderId: UUID,
    orderTotal: Money,
  ): Promise<PaymentReserved> {}

  @restate.handler()
  async reverse(paymentId: UUID): Promise<PaymentReserved> {}
}
