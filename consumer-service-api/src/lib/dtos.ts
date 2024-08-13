import { UUID } from '@deepkit/type';

import { Money } from '@ftgo/common';

export interface ValidateOrderRequest {
  readonly consumerId: UUID;
  readonly orderId: UUID;
  readonly orderTotal: Money;
}
