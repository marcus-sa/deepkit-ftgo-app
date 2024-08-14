import { UUID } from '@deepkit/type';

export class ConsumerNotFound extends Error {
  constructor(readonly id: UUID) {
    super();
  }
}

export class ConsumerCreated extends Error {
  constructor(readonly id: UUID) {
    super();
  }
}

export class ConsumerVerificationFailed extends Error {
  constructor(readonly id: UUID) {
    super();
  }
}
