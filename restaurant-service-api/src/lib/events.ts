import { UUID } from '@deepkit/type';

export class RestaurantCreatedEvent {
  constructor(public readonly restaurantId: UUID) {}
}
