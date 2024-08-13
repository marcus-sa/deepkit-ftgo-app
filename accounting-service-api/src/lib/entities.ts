import { entity, JSONEntity, JSONPartial, uuid, UUID } from '@deepkit/type';

import { Consumer } from '@ftgo/consumer-service-api';

@entity.name('account')
export class Account {
  readonly id: UUID = uuid();
  readonly consumerId: Consumer['id'];

  static create(data: JSONPartial<Account>): Account {
    return Object.assign(new Account(), data);
  }
}
