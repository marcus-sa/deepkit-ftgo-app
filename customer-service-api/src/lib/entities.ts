import {
  Email,
  entity,
  JSONPartial,
  PrimaryKey,
  Unique,
  uuid,
  UUID,
} from '@deepkit/type';
import { Writable } from 'type-fest';

import { PersonName } from '@ftgo/common';

import { CustomerDisabled } from './replies';

@entity.name('customer')
export class Customer {
  readonly id: UUID & PrimaryKey = uuid();
  readonly disabled: boolean = false;

  readonly name: PersonName;
  readonly email: Email & Unique;
  readonly phoneNumber?: string & Unique;

  static create(data: JSONPartial<Customer>) {
    return Object.assign(new Customer(), data);
  }

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
