import { RestateService } from 'deepkit-restate';
import { float, UUID } from '@deepkit/type';

import { Money } from '@ftgo/common';

import { PaymentCustomer } from './entities';
import {
  PaymentAuthorizationFailed,
  PaymentAuthorized,
  PaymentCustomerNotFound,
} from './replies';

export interface PaymentServiceHandlers {
  authorize(
    customerId: UUID,
    orderId: UUID,
    orderTotal: Money,
  ): Promise<PaymentAuthorized>;
  reverseAuthorization(paymentId: UUID): Promise<PaymentAuthorized>;
  getCustomer(customerId: UUID): Promise<PaymentCustomer>;
}

export type PaymentServiceApi = RestateService<
  'Payment',
  PaymentServiceHandlers,
  [PaymentAuthorizationFailed, PaymentCustomerNotFound]
>;
