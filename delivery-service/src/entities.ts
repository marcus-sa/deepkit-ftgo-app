import { entity, PrimaryKey, uuid, UUID } from '@deepkit/type';

@entity.name('delivery')
export class Delivery {
  readonly id: UUID & PrimaryKey = uuid();
}
