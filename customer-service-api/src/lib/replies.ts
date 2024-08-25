import { UUID } from '@deepkit/type';

export class CustomerNotFound extends Error {
  constructor(public readonly id: UUID) {
    super();
  }
}

export class CustomerVerificationFailed extends Error {
  constructor(public readonly id: UUID) {
    super();
  }
}

export class CustomerDisabled extends Error {
  constructor(public readonly id: UUID) {
    super();
  }
}
