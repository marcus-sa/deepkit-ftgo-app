import { entity, uuid, UUID } from '@deepkit/type';

@entity.name('account')
export class Account {
  readonly id: UUID = uuid();

  constructor(readonly consumerId: UUID) {}
}
