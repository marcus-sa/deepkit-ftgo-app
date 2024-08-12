import {entity, JSONEntity} from "@deepkit/type";

@entity.name('order')
export class Order {
  static create(data: JSONEntity<Order>): Order {
    return new Order();
  }
}

