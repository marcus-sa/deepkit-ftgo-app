import { beforeEach, describe, test, expect } from 'vitest';
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
  KitchenServiceApi,
  TicketCancelled,
  TicketConfirmed,
  TicketCreated,
} from '@ftgo/kitchen-service-api';
import {
  CustomerOrderValidationFailed,
  CustomerServiceApi,
} from '@ftgo/customer-service-api';
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

  const orderId = uuid();
  const customerId = uuid();
  const restaurantId = uuid();

  beforeEach(() => {
    ctx = new RestateInMemoryContext() as unknown as RestateSagaContext;

    const customer = createClassProxy<CustomerServiceApi>();
    const order = createClassProxy<OrderServiceApi>();
    const kitchen = createClassProxy<KitchenServiceApi>();
    const payment = createClassProxy<PaymentServiceApi>();

    saga = new CreateOrderSaga(customer, order, kitchen, payment, ctx);

    manager = new SagaTestManager(ctx, saga);

    data = Object.assign(new CreateOrderSagaData(), {
      orderId,
      orderDetails: {
        restaurantId,
        customerId,
        lineItems: [],
        orderTotal: new Money(10),
      },
    });
  });

  describe('given order has been placed', () => {
    beforeEach(() => {
      manager.mockInvocationResponse('create', () => success());
    });

    describe('and order has been created', () => {
      describe('and customer order failed to be validated', () => {
        beforeEach(() => {
          manager.mockInvocationResponse('validate', () =>
            failure<CustomerOrderValidationFailed>(
              new CustomerOrderValidationFailed(customerId, orderId),
            ),
          );
        });

        describe('when handled', () => {
          beforeEach(() => {
            manager.runAfterReplyHandler(
              'handleCustomerOrderValidationFailed',
              data => {
                expect(data.state).toBe(
                  CreateOrderSagaState.CUSTOMER_VALIDATION_FAILED,
                );
              },
            );
          });

          test('then order was rejected', async () => {
            manager.mockCompensationResponse('reject', () =>
              success<OrderRejected>(new OrderRejected()),
            );

            manager.runAfterReplyHandler('handleRejected', data => {
              expect(data.state).toBe(CreateOrderSagaState.REJECTED);
              expect(data.rejectedState).toBe(
                CreateOrderSagaState.CUSTOMER_VALIDATION_FAILED,
              );
            });

            await manager.start(data);

            await manager.waitForHandlersToHaveBeenCalled();
          });
        });
      });

      describe('and customer order has been validated', () => {
        beforeEach(() => {
          manager.mockInvocationResponse('validate', () => success());
        });

        describe('and payment failed to be authorized', () => {
          const paymentId = uuid();

          beforeEach(() => {
            manager.mockInvocationResponse('authorizePayment', () =>
              failure<PaymentAuthorizationFailed>(
                new PaymentAuthorizationFailed(
                  paymentId,
                  customerId,
                  'Balance too low',
                ),
              ),
            );
          });

          describe('when handled', () => {
            beforeEach(() => {
              manager.runAfterReplyHandler(
                'handlePaymentAuthorizationFailed',
                data => {
                  expect(data.state).toBe(
                    CreateOrderSagaState.PAYMENT_AUTHORIZATION_FAILED,
                  );
                  expect(data.paymentId).toBe(paymentId);
                },
              );
            });

            test('then order has been rejected', async () => {
              manager.mockCompensationResponse('reject', () =>
                success<OrderRejected>(new OrderRejected()),
              );

              manager.runAfterReplyHandler('handleRejected', data => {
                expect(data.state).toBe(CreateOrderSagaState.REJECTED);
                expect(data.rejectedState).toBe(
                  CreateOrderSagaState.PAYMENT_AUTHORIZATION_FAILED,
                );
              });

              await manager.start(data);

              await manager.waitForHandlersToHaveBeenCalled();
            });
          });
        });

        describe('and payment has been authorized', () => {
          const paymentId = uuid();

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

            test('then has been handled', async () => {
              manager.runAfterReplyHandler('handleTicketCreated', data => {
                expect(data.state).toBe(
                  CreateOrderSagaState.WAITING_FOR_TICKET_CONFIRMATION,
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
                    ctx.rejectAwakeable(
                      saga.confirmTicketAwakeable!.id,
                      'Test',
                    );
                  });
                });

                test('then reverse payment authorization', () => {
                  // manager.runAfterInvocation('waitForTicketConfirmation', (data) => {
                  //   expect(data.state).toBe(CreateOrderSagaState.TICKET_REJECTED);
                  // });
                  manager.mockCompensationResponse(
                    'reversePaymentAuthorization',
                    () => {
                      expect(data.state).toBe(
                        CreateOrderSagaState.TICKET_REJECTED,
                      );
                      return success();
                    },
                  );
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
                  //   expect(data.state).toBe(CreateOrderSagaState.TICKET_CONFIRMED);
                  // });
                  manager.mockInvocationResponse('approve', data => {
                    expect(data.state).toBe(
                      CreateOrderSagaState.TICKET_CONFIRMED,
                    );
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

                  test('then has been handled', async () => {
                    manager.runAfterReplyHandler('handleApproved', data => {
                      expect(data.state).toBe(CreateOrderSagaState.APPROVED);
                    });

                    await manager.start(data);

                    await manager.waitForHandlersToHaveBeenCalled();
                  });
                });

                describe('and order failed to be approved', () => {
                  beforeEach(() => {
                    manager.mockInvocationResponse('approve', () => failure());
                  });

                  test('then cancel ticket', async () => {});

                  describe('and ticket has been cancelled', () => {
                    beforeEach(() => {
                      manager.mockCompensationResponse('cancelTicket', () =>
                        success<TicketCancelled>(new TicketCancelled(ticketId)),
                      );
                    });

                    test('then has been handled', async () => {
                      manager.runAfterReplyHandler(
                        'handleTicketCancelled',
                        data => {
                          expect(data.state).toBe(
                            CreateOrderSagaState.TICKET_CANCELLED,
                          );
                        },
                      );
                    });
                  });

                  describe.todo('and failed to cancel ticket');
                });
              });
            });
          });
        });
      });
    });
  });
});
