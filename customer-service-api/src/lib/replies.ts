import { entity, UUID } from '@deepkit/type';

@entity.name('@error/CustomerNotFound')
export class CustomerNotFound extends Error {
  constructor(public readonly id: UUID) {
    super();
  }
}

@entity.name('@error/CustomerOrderValidationFailed')
export class CustomerOrderValidationFailed extends Error {
  constructor(
    public readonly customerId: UUID,
    public readonly orderId: UUID,
  ) {
    super('Customer order failed to be validated');
  }
}

@entity.name('@error/CustomerDisabled')
export class CustomerDisabled extends Error {
  constructor(public readonly id: UUID) {
    super();
  }
}

export class CustomerOrderValidated {}
