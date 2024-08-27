import { entity, UUID } from '@deepkit/type';

@entity.name('@error/CustomerNotFound')
export class CustomerNotFound extends Error {
  constructor(public readonly id: UUID) {
    super();
  }
}

@entity.name('@error/CustomerVerificationFailed')
export class CustomerVerificationFailed extends Error {
  constructor(public readonly id: UUID) {
    super();
  }
}

@entity.name('@error/CustomerDisabled')
export class CustomerDisabled extends Error {
  constructor(public readonly id: UUID) {
    super();
  }
}
