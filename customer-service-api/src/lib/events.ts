import { Email, UUID } from '@deepkit/type';

import { PersonName } from '@ftgo/common';

export class CustomerCreatedEvent {
  constructor(
    public readonly id: UUID,
    public readonly name: PersonName,
    public readonly email: Email,
    public readonly phoneNumber?: string,
  ) {}
}
