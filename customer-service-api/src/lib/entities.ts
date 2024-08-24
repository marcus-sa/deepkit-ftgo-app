import { entity, PrimaryKey, uuid, UUID } from '@deepkit/type';
import { Writable } from 'type-fest';

import { PersonName } from '@ftgo/common';

import { CustomerDisabled } from './replies';

@entity.name('customer')
export class Customer {
  readonly id: UUID & PrimaryKey = uuid();
  readonly disabled: boolean = false;

  constructor(readonly name: PersonName) {}

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
