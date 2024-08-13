import { entity, JSONEntity } from '@deepkit/type';

@entity.name('kitchen')
export class Kitchen {
  static create(data: JSONEntity<Kitchen>): Kitchen {
    return new Kitchen();
  }
}
