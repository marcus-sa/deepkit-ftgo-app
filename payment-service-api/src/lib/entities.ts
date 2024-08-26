import { entity, PrimaryKey, Unique, uuid, UUID } from '@deepkit/type';

@entity.name('payment-customer')
export class PaymentCustomer {
  readonly id: UUID & PrimaryKey = uuid();

  constructor(
    public readonly stripeCustomerId: string & Unique,
    public readonly customerId: UUID & Unique,
  ) {}
}
