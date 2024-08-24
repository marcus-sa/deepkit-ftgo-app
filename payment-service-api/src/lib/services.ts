import { RestateService } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { Money } from '@ftgo/common';

import { Payment } from './entities';
import {
  PaymentAuthorizationFailed,
  PaymentAuthorized,
  StripeCustomerNotFound,
} from './replies';

export interface PaymentServiceHandlers {
  authorize(
    customerId: UUID,
    orderId: UUID,
    orderTotal: Money,
  ): Promise<PaymentAuthorized>;
  reverseAuthorization(paymentId: UUID): Promise<PaymentAuthorized>;
}

export type PaymentServiceApi = RestateService<
  'Payment',
  PaymentServiceHandlers,
  [Payment, PaymentAuthorizationFailed, StripeCustomerNotFound]
>;
