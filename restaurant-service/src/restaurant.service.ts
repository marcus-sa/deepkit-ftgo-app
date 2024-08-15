import { UUID } from '@deepkit/type';
import { restate, RestateEventsPublisher } from 'deepkit-restate';

import {
  CreateRestaurantRequest,
  Restaurant,
  RestaurantCreatedEvent,
  RestaurantServiceApi,
  RestaurantServiceHandlers,
} from '@ftgo/restaurant-service-api';

import { RestaurantRepository } from './restaurant.repository';

@restate.service<RestaurantServiceApi>()
export class RestaurantService implements RestaurantServiceHandlers {
  constructor(
    private readonly restaurant: RestaurantRepository,
    private readonly events: RestateEventsPublisher,
  ) {}

  @restate.handler()
  async create(request: CreateRestaurantRequest): Promise<Restaurant> {
    const restaurant = await this.restaurant.create(request);
    await this.events.publish([new RestaurantCreatedEvent(restaurant)]);
    return restaurant;
  }
}
