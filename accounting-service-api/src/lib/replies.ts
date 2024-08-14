import { UUID } from '@deepkit/type';

export class AccountDisabled extends Error {
  constructor(readonly accountId: UUID) {
    super();
  }
}

export class AccountCreated {
  constructor(readonly accountId: UUID) {}
}

export class AccountNotFound extends Error {}

export class AccountAuthorized {
  constructor(readonly accountId: UUID) {}
}

export class AccountAuthorizationFailed extends Error {
  constructor(
    readonly accountId: UUID,
    readonly reason: string,
  ) {
    super();
  }
}
