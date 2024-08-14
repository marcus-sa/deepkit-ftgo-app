import { Restaurant } from './entities';

export class RestaurantCreatedEvent {
  constructor(readonly restaurant: Restaurant) {}
}
