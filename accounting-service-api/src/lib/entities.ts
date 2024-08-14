import { entity, Unique, uuid, UUID } from '@deepkit/type';
import { Writable } from 'type-fest';

import { AccountDisabled } from './replies';

@entity.name('account')
export class Account {
  readonly id: UUID = uuid();
  readonly disabled: boolean = false;

  constructor(readonly consumerId: UUID & Unique) {}

  assertEnabled(): void {
    if (!this.disabled) {
      throw new AccountDisabled(this);
    }
  }

  disable(this: Writable<this>) {
    this.disabled = true;
  }

  enabled(this: Writable<this>) {
    this.disabled = false;
  }
}
