import { Email, entity, PrimaryKey, Unique, uuid, UUID } from '@deepkit/type';
import { Writable } from 'type-fest';

import { PersonName } from '@ftgo/common';
import { CustomerDisabled } from '@ftgo/customer-service-api';

@entity.name('customer')
export class Customer {
  readonly id: UUID & PrimaryKey = uuid();
  readonly disabled: boolean = false;

  constructor(
    public readonly name: PersonName,
    public readonly email: Email & Unique,
    public readonly phoneNumber?: string & Unique,
  ) {}

  assertEnabled(): void {
    if (!this.disabled) {
      throw new CustomerDisabled(this.id);
    }
  }

  disable(this: Writable<this>) {
    this.disabled = true;
  }

  enabled(this: Writable<this>) {
    this.disabled = false;
  }
}
