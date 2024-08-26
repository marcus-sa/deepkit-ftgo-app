import { UUID } from '@deepkit/type';
import { restate, RestateEventsPublisher } from 'deepkit-restate';

import { Address } from '@ftgo/common';
import {
  Menu,
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
  async create(name: string, address: Address, menu: Menu): Promise<UUID> {
    const restaurant = await this.restaurant.create(name, address, menu);
    await this.events.publish<[RestaurantCreatedEvent]>([
      new RestaurantCreatedEvent(restaurant.id),
    ]);
    return restaurant.id;
  }
}
