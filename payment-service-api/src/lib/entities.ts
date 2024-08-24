import { entity, Unique, uuid, UUID } from '@deepkit/type';

@entity.name('payment')
export class Payment {
  readonly id: UUID = uuid();
}
