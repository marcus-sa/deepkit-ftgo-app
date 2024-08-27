import { RestateService } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { Money } from '@ftgo/common';

import { PaymentCustomer } from './entities';
import { PaymentAuthorizationReversed, PaymentAuthorized } from './replies';

export interface PaymentServiceHandlers {
  /**
   * @throws PaymentAuthorizationFailed
   */
  authorize(
    customerId: UUID,
    orderId: UUID,
    orderTotal: Money,
  ): Promise<PaymentAuthorized>;
  /**
   * @throws PaymentReverseAuthorizationFailed
   */
  reverseAuthorization(paymentId: UUID): Promise<PaymentAuthorizationReversed>;
  /**
   * @throws PaymentCustomerNotFound
   */
  getCustomer(customerId: UUID): Promise<PaymentCustomer>;
}

export type PaymentServiceApi = RestateService<
  'Payment',
  PaymentServiceHandlers
>;
