import { uuid } from '@deepkit/type';
import {
  createClassProxy,
  failure,
  RestateSagaContext,
  success,
  SagaTestManager,
  RestateInMemoryContext,
} from 'deepkit-restate';
import {
  beforeEach,
  describe,
  Mock,
  test,
  vi,
  expect,
  afterEach,
} from 'vitest';

import {
  KitchenServiceApi,
  TicketConfirmed,
  TicketCreated,
} from '@ftgo/kitchen-service-api';
import { CustomerServiceApi } from '@ftgo/customer-service-api';
import { Money } from '@ftgo/common';
import {
  CreateOrderSagaData,
  CreateOrderSagaState,
  OrderApproved,
  OrderRejected,
  OrderServiceApi,
} from '@ftgo/order-service-api';
import {
  PaymentAuthorizationFailed,
  PaymentAuthorized,
  PaymentServiceApi,
} from '@ftgo/payment-service-api';

import { CreateOrderSaga } from './create-order.saga';

describe('CreateOrderSaga', () => {
  let ctx: RestateSagaContext;
  let saga: CreateOrderSaga;
  let manager: SagaTestManager<CreateOrderSagaData, CreateOrderSaga>;
  let data: CreateOrderSagaData;

  beforeEach(() => {
    ctx = new RestateInMemoryContext() as unknown as RestateSagaContext;

    const customer = createClassProxy<CustomerServiceApi>();
    const order = createClassProxy<OrderServiceApi>();
    const kitchen = createClassProxy<KitchenServiceApi>();
    const payment = createClassProxy<PaymentServiceApi>();

    saga = new CreateOrderSaga(customer, order, kitchen, payment, ctx);

    manager = new SagaTestManager(ctx, saga);

    data = Object.assign(new CreateOrderSagaData(), {
      orderId: '69181046-3f54-42b1-811b-f423846b0f0f',
      orderDetails: {
        restaurantId: 'd5237427-9e29-426a-b679-ff8d10262014',
        customerId: '929edf6a-497e-4bf9-ab00-48adeeb1d8ef',
        lineItems: [],
        orderTotal: new Money(10),
      },
    });
  });

  describe('given order has been placed', () => {
    beforeEach(() => {
      manager.mockInvocationResponse('create', () => success());
    });

    // test('then validate customer order', () => {});

    describe('and customer order failed to be validated', () => {
      beforeEach(() => {
        manager.mockInvocationResponse('validate', () => failure());
      });

      test('then order was rejected', async () => {
        manager.mockCompensationResponse('reject', () =>
          success<OrderRejected>(new OrderRejected()),
        );

        manager.runAfterReplyHandler('handleRejected', data => {
          expect(data.state).toBe(CreateOrderSagaState.REJECTED);
        });

        await manager.start(data);

        await manager.waitForHandlersToHaveBeenCalled();
      });
    });

    describe('and customer order has been validated', () => {
      beforeEach(() => {
        manager.mockInvocationResponse('validate', () => success());
      });

      describe('and payment failed to be authorized', () => {
        beforeEach(() => {
          manager.mockInvocationResponse('authorizePayment', () =>
            failure<PaymentAuthorizationFailed>(
              new PaymentAuthorizationFailed(uuid(), 'Test'),
            ),
          );
        });
      });

      describe('and payment has been authorized', () => {
        const paymentId = '64b1650f-6be3-4b3a-9749-ca6534128126';

        beforeEach(() => {
          manager.mockInvocationResponse('authorizePayment', () =>
            success<PaymentAuthorized>(new PaymentAuthorized(paymentId)),
          );
        });

        test('then payment authorization has been handled', async () => {
          manager.runAfterReplyHandler('handlePaymentAuthorized', data => {
            expect(data.state).toBe(CreateOrderSagaState.PAYMENT_AUTHORIZED);
            expect(data.paymentId).toBe(paymentId);
          });

          await manager.start(data);

          await manager.waitForHandlersToHaveBeenCalled();
        });

        describe('and ticket has been created', () => {
          const ticketId = 'f3a52feb-eb2f-4985-83c7-12dbfc0056ed';

          beforeEach(() => {
            manager.mockInvocationResponse('createTicket', () =>
              success<TicketCreated>(new TicketCreated(ticketId)),
            );
          });

          test('then ticket creation has been handled', async () => {
            manager.runAfterReplyHandler('handleTicketCreated', data => {
              expect(data.state).toBe(
                CreateOrderSagaState.WAITING_FOR_CONFIRMATION,
              );
              expect(data.ticketId).toBe(ticketId);
            });

            await manager.start(data);

            await manager.waitForHandlersToHaveBeenCalled();
          });

          describe('then wait for ticket confirmation', () => {
            describe('when ticket has been rejected', () => {
              beforeEach(() => {
                manager.runAfterReplyHandler('handleTicketCreated', () => {
                  ctx.rejectAwakeable(saga.confirmTicketAwakeable!.id, 'Test');
                });
              });

              test('then cancel ticket', async () => {
                manager.mockCompensationResponse('cancelTicket', () =>
                  success(),
                );

                await manager.start(data);

                await manager.waitForHandlersToHaveBeenCalled();
              });

              describe('and ticket has been cancelled', () => {
                test.todo('then reverse payment authorization');
              });
            });

            describe('when ticket has been confirmed', () => {
              beforeEach(() => {
                manager.runAfterReplyHandler('handleTicketCreated', () => {
                  ctx.resolveAwakeable(
                    saga.confirmTicketAwakeable!.id,
                    new TicketConfirmed(new Date()),
                  );
                });
              });

              test('then order state should be confirmed', async () => {
                // manager.runAfterInvocation('waitForTicketConfirmation', (data) => {
                //   expect(data.state).toBe(CreateOrderSagaState.CONFIRMED);
                // });
                manager.mockInvocationResponse('approve', data => {
                  expect(data.state).toBe(CreateOrderSagaState.CONFIRMED);
                  return success();
                });

                await manager.start(data);

                await manager.waitForHandlersToHaveBeenCalled();
              });

              describe('and order has been approved', () => {
                beforeEach(() => {
                  manager.mockInvocationResponse('approve', () =>
                    success<OrderApproved>(new OrderApproved()),
                  );
                });

                test('then handle order approval', async () => {
                  manager.runAfterReplyHandler('handleApproved', data => {
                    expect(data.state).toBe(CreateOrderSagaState.APPROVED);
                  });

                  await manager.start(data);

                  await manager.waitForHandlersToHaveBeenCalled();
                });
              });
            });
          });
        });
      });
    });
  });
});
