import {entity, PrimaryKey, UUID} from "@deepkit/type";

import {PersonName} from "@ftgo/shared";

@entity.name('consumer')
export class Consumer {
  readonly id: UUID & PrimaryKey;
  readonly name: PersonName;

  static create(data: Partial<Consumer>) {
    return Object.assign(new Consumer(), data);
  }
}

