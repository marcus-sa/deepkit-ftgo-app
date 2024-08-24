import { restate, Saga } from 'deepkit-restate';

import { KitchenServiceApi } from '@ftgo/kitchen-service-api';
import { PaymentServiceApi } from '@ftgo/payment-service-api';
import {
  CancelOrderSagaApi,
  CancelOrderSagaData,
  OrderServiceApi,
} from '@ftgo/order-service-api';

@restate.saga<CancelOrderSagaApi>()
export class CancelOrderSaga extends Saga<CancelOrderSagaData> {
  readonly definition = this.step()
    .invoke(this.beginCancelOrder)
    .compensate(this.undoBeginCancelOrder)
    .step()
    .invoke(this.beginCancelTicket)
    .compensate(this.undoBeginCancelTicket)
    .step()
    .invoke(this.reverseAuthorization)
    .step()
    .invoke(this.confirmCancelTicket)
    .step()
    .invoke(this.confirmCancelOrder)
    .build();

  constructor(
    private readonly order: OrderServiceApi,
    private readonly kitchen: KitchenServiceApi,
    private readonly accounting: PaymentServiceApi,
  ) {
    super();
  }

  beginCancelOrder({ orderId }: CancelOrderSagaData) {
    return this.order.beginCancel(orderId);
  }

  undoBeginCancelOrder({ orderId }: CancelOrderSagaData) {
    return this.order.undoBeginCancel(orderId);
  }

  beginCancelTicket({ restaurantId, orderId }: CancelOrderSagaData) {
    return this.kitchen.beginCancelTicket(restaurantId, orderId);
  }

  undoBeginCancelTicket({ restaurantId, orderId }: CancelOrderSagaData) {
    return this.kitchen.undoBeginCancelTicket(restaurantId, orderId);
  }

  reverseAuthorization({
    customerId,
    orderId,
    orderTotal,
  }: CancelOrderSagaData) {
    return this.accounting.reverseAuthorization(
      customerId,
      orderId,
      orderTotal,
    );
  }

  confirmCancelTicket({ restaurantId, orderId }: CancelOrderSagaData) {
    return this.kitchen.confirmCancelTicket(restaurantId, orderId);
  }

  confirmCancelOrder({ orderId }: CancelOrderSagaData) {
    return this.order.confirmCancel(orderId);
  }
}
