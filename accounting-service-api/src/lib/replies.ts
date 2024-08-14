import { UUID } from '@deepkit/type';

export class AccountDisabled extends Error {
  constructor(readonly id: UUID) {
    super();
  }
}

export class AccountCreated {
  constructor(readonly id: UUID) {}
}

export class AccountNotFound extends Error {}

export class AccountAuthorized {
  constructor(readonly id: UUID) {}
}

export class AccountAuthorizationFailed extends Error {
  constructor(
    readonly id: UUID,
    readonly reason: string,
  ) {
    super();
  }
}
