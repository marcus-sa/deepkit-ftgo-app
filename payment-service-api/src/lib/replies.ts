import { UUID } from '@deepkit/type';

export class PaymentAuthorized {
  constructor(readonly customerId: UUID) {}
}

export class PaymentReserved {
  constructor(readonly paymentId: UUID) {}
}

export class PaymentReversed {
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
