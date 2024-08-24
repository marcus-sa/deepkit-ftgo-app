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
} from '@ftgo/payment-service-api';

import { PaymentRepository } from './payment.repository';
import { StripeCustomerRepository } from './stripe-customer.repository';
import { Stripe } from './stripe';
import { StripePaymentIntent } from './types';

@restate.service<PaymentServiceApi>()
export class PaymentService implements PaymentServiceHandlers {
  constructor(
    private readonly payment: PaymentRepository,
    private readonly stripeCustomer: StripeCustomerRepository,
    private readonly stripe: Stripe,
    private readonly ctx: RestateServiceContext,
  ) {}

  @(restate.event<CustomerCreatedEvent>().handler())
  async handleCustomerCreated({
    id,
    email,
    name,
    phoneNumber,
  }: CustomerCreatedEvent): Promise<void> {
    const { id: stripeCustomerId } = await this.ctx.run<{ id: UUID }>(() =>
      this.stripe.customers.create({
        email,
        phone: phoneNumber as string,
        name: `${name.firstName} ${name.lastName}`,
        metadata: {
          customerId: id,
        },
      }),
    );

    await this.stripeCustomer.create({
      id: stripeCustomerId,
      customerId: id,
    });
  }

  @restate.handler()
  async authorize(
    customerId: UUID,
    orderId: UUID,
    orderTotal: Money,
  ): Promise<PaymentAuthorized> {
    const stripeCustomer =
      await this.stripeCustomer.findByCustomerId(customerId);

    const [paymentIntent, error] = await this.ctx.run<
      [StripePaymentIntent, Error?]
    >(async () => {
      try {
        return [
          await this.stripe.paymentIntents.create({
            customer: stripeCustomer.id,
            currency: 'usd',
            automatic_payment_methods: {
              enabled: true,
            },
            confirmation_method: 'manual',
            capture_method: 'manual',
            payment_method_options: {
              card: {
                capture_method: 'manual',
              },
            },
            amount: orderTotal.cents,
          }),
        ];
      } catch (err) {
        if (err.type === 'StripeCardError') {
          return [err.payment_intent, err];
        }

        throw err;
      }
    });

    const payment = await this.payment.create({
      stripePaymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      customerId,
      orderTotal,
      orderId,
    });

    if (error) {
      throw new PaymentAuthorizationFailed(customerId, error.message);
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
}
