import { entity, PrimaryKey, uuid, UUID } from '@deepkit/type';

import { PersonName } from '@ftgo/common';

@entity.name('courier')
export class Courier {
  readonly id: UUID & PrimaryKey = uuid();

  constructor(public readonly name: PersonName) {}
}
