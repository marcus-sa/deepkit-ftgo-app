import { RestateService } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { CustomerCreatedEvent } from '@ftgo/customer-service-api';
import { Money } from '@ftgo/common';

import {
  PaymentAuthorizationFailed,
  PaymentAuthorized,
  PaymentReserved,
} from './replies';
import { Payment } from './entities';

export interface PaymentServiceHandlers {
  createCustomer(event: CustomerCreatedEvent): Promise<void>;
  reserve(
    customerId: UUID,
    orderId: UUID,
    orderTotal: Money,
  ): Promise<PaymentReserved>;
  reverse(paymentId: UUID): Promise<PaymentReserved>;
}

export type PaymentServiceApi = RestateService<
  'Payment',
  PaymentServiceHandlers,
  [Payment, PaymentAuthorizationFailed]
>;
