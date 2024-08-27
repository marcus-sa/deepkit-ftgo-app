import { entity, UUID } from '@deepkit/type';

export class PaymentAuthorized {
  constructor(public readonly paymentId: UUID) {}
}

export class PaymentAuthorizationReversed {
  constructor(public readonly paymentId: UUID) {}
}

@entity.name('@error/PaymentAuthorizationFailed')
export class PaymentAuthorizationFailed extends Error {
  constructor(
    public readonly customerId: UUID,
    public readonly reason: string,
  ) {
    super();
  }
}

@entity.name('@error/PaymentNotFound')
export class PaymentNotFound extends Error {
  constructor(public readonly paymentId: UUID) {
    super();
  }
}

@entity.name('@error/PaymentCustomerNotFound')
export class PaymentCustomerNotFound extends Error {
  constructor(public readonly customerId: UUID) {
    super();
  }
}
