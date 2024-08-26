import { entity, UUID } from '@deepkit/type';

export class PaymentAuthorized {
  constructor(public readonly paymentId: UUID) {}
}

export class PaymentAuthorizationReversed {
  constructor(public readonly paymentId: UUID) {}
}

export class PaymentAuthorizationFailed extends Error {
  constructor(
    public readonly customerId: UUID,
    public readonly reason: string,
  ) {
    super();
  }
}

export class PaymentNotFound extends Error {
  constructor(public readonly paymentId: UUID) {
    super();
  }
}

export class PaymentCustomerNotFound extends Error {
  constructor(public readonly customerId: UUID) {
    super();
  }
}
