import { UUID } from '@deepkit/type';

import { Money } from '@ftgo/common';

export interface ValidateOrderRequest {
  readonly customerId: UUID;
  readonly orderId: UUID;
  readonly orderTotal: Money;
}
