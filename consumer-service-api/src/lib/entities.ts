import { entity, PrimaryKey, uuid, UUID } from '@deepkit/type';

import { PersonName } from '@ftgo/common';

@entity.name('consumer')
export class Consumer {
  readonly id: UUID & PrimaryKey = uuid();

  constructor(readonly name: PersonName) {}
}
