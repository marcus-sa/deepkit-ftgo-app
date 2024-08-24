import { UUID } from '@deepkit/type';

export class CustomerNotFound extends Error {
  constructor(readonly id: UUID) {
    super();
  }
}

export class CustomerVerificationFailed extends Error {
  constructor(readonly id: UUID) {
    super();
  }
}

export class CustomerDisabled extends Error {
  constructor(readonly id: UUID) {
    super();
  }
}
