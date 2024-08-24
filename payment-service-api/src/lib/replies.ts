import { UUID } from '@deepkit/type';

export class PaymentAuthorized {
  constructor(readonly paymentId: UUID) {}
}

export class PaymentAuthorizationReversed {
  constructor(readonly paymentId: UUID) {}
}

export class PaymentAuthorizationFailed extends Error {
  constructor(
    readonly customerId: UUID,
    readonly reason: string,
  ) {
    super();
  }
}

export class PaymentNotFound extends Error {
  constructor(readonly paymentId: UUID) {
    super();
  }
}

export class StripeCustomerNotFound extends Error {
  constructor(readonly customerId: UUID) {
    super();
  }
}
