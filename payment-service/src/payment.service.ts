import { restate, RestateServiceContext } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { CustomerCreatedEvent } from '@ftgo/customer-service-api';
import { Money } from '@ftgo/common';
import {
  PaymentAuthorizationFailed,
  PaymentAuthorizationReversed,
  PaymentAuthorized,
  PaymentServiceApi,
  PaymentServiceHandlers,
  PaymentCustomer,
} from '@ftgo/payment-service-api';

import { PaymentRepository } from './payment.repository';
import { CustomerRepository } from './customer.repository';
import { Stripe, StripeCardError } from './stripe';
import { StripePaymentIntent } from './types';

@restate.service<PaymentServiceApi>()
export class PaymentService implements PaymentServiceHandlers {
  constructor(
    private readonly payment: PaymentRepository,
    private readonly customer: CustomerRepository,
    private readonly stripe: Stripe,
    private readonly ctx: RestateServiceContext,
  ) {}

  // @ts-expect-error invalid number of arguments
  @(restate.event<CustomerCreatedEvent>().handler())
  async handleCustomerCreated({
    id: customerId,
    email,
    name,
    phoneNumber,
  }: CustomerCreatedEvent): Promise<void> {
    const { id: stripeCustomerId } = await this.ctx.run<{ id: string }>(() =>
      this.stripe.customers.create({
        email,
        phone: phoneNumber as string,
        name: `${name.firstName} ${name.lastName}`,
        metadata: {
          customerId,
        },
      }),
    );

    await this.customer.create(stripeCustomerId, customerId);
  }

  @restate.handler()
  async authorize(
    customerId: UUID,
    orderId: UUID,
    orderTotal: Money,
  ): Promise<PaymentAuthorized> {
    const customer = await this.customer.findByCustomerId(customerId);

    const [paymentIntent, error] = await this.ctx.run<
      [StripePaymentIntent, Error?]
    >(async () => {
      try {
        return [
          await this.stripe.paymentIntents.create({
            customer: customer.stripeCustomerId,
            currency: 'usd',
            confirmation_method: 'manual',
            capture_method: 'manual',
            // TODO: configurable
            payment_method: 'pm_card_visa_debit',
            payment_method_options: {
              card: {
                capture_method: 'manual',
              },
            },
            amount: orderTotal.cents,
          }),
        ] as [StripePaymentIntent];
      } catch (err) {
        if (err instanceof StripeCardError) {
          return [err.payment_intent, err] as [StripePaymentIntent, Error];
        }

        throw err;
      }
    });

    const payment = await this.payment.create(
      customerId,
      orderId,
      orderTotal,
      paymentIntent.id,
      paymentIntent.status,
    );

    if (error) {
      throw new PaymentAuthorizationFailed(
        payment.id,
        customerId,
        error.message,
      );
    }

    return new PaymentAuthorized(payment.id);
  }

  @restate.handler()
  async reverseAuthorization(
    paymentId: UUID,
  ): Promise<PaymentAuthorizationReversed> {
    const payment = await this.payment.findById(paymentId);

    payment.cancel();

    await this.ctx.run(() =>
      this.stripe.paymentIntents.cancel(payment.stripePaymentIntentId),
    );

    await this.payment.save(payment);

    return new PaymentAuthorizationReversed(paymentId);
  }

  @restate.handler()
  async getCustomer(customerId: UUID): Promise<PaymentCustomer> {
    return await this.customer.findByCustomerId(customerId);
  }
}
