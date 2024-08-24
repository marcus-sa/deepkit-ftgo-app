import { Email, UUID } from '@deepkit/type';

import { PersonName } from '@ftgo/common';

export class CustomerCreatedEvent {
  constructor(
    readonly id: UUID,
    readonly name: PersonName,
    readonly email: Email,
    readonly phoneNumber?: string,
  ) {}
}
