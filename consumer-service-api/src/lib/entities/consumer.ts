import {entity, JSONEntity, PrimaryKey, uuid, UUID} from "@deepkit/type";

import {PersonName} from "@ftgo/common";

@entity.name('consumer')
export class Consumer {
  readonly id: UUID & PrimaryKey = uuid();
  readonly name: PersonName;

  static create(data: JSONEntity<Consumer>) {
    return Object.assign(new Consumer(), data);
  }
}

