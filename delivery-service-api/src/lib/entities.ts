import { entity, JSONEntity } from '@deepkit/type';

@entity.name('delivery')
export class Delivery {
  static create(data: JSONEntity<Delivery>): Delivery {
    return new Delivery();
  }
}
