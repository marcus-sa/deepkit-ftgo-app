import { restate } from 'deepkit-restate';
import { RestateKafkaProducer } from 'deepkit-restate/kafka';

import {
  CreateRestaurantRequest,
  KafkaRestaurantCreatedTopic,
  Restaurant,
  RestaurantServiceApi,
  RestaurantServiceHandlers,
} from '@ftgo/restaurant-service-api';

import { RestaurantRepository } from './restaurant.repository.js';

@restate.service<RestaurantServiceApi>()
export class RestaurantService implements RestaurantServiceHandlers {
  constructor(
    private readonly restaurant: RestaurantRepository,
    private readonly kafka: RestateKafkaProducer,
  ) {}

  @restate.handler()
  async create(request: CreateRestaurantRequest): Promise<Restaurant> {
    // FIXME: why is type T and not Restaurant ?
    const restaurant = (await this.restaurant.create(request)) as Restaurant;
    await this.kafka.produce<KafkaRestaurantCreatedTopic>([restaurant]);
    return restaurant;
  }
}
