import { restate, RestateServiceContext } from 'deepkit-restate';
import { RestateKafkaProducer } from 'deepkit-restate/kafka';

import {
  CreateRestaurantRequest,
  KafkaRestaurantCreatedTopic,
  Restaurant,
  RestaurantServiceApi,
  RestaurantServiceHandlers,
} from '@ftgo/restaurant-service-api';

import { RestaurantRepository } from './restaurant.repository';

@restate.service<RestaurantServiceApi>()
export class RestaurantService implements RestaurantServiceHandlers {
  constructor(
    private readonly ctx: RestateServiceContext,
    private readonly restaurant: RestaurantRepository,
    private readonly kafka: RestateKafkaProducer,
  ) {}

  @restate.handler()
  async create(request: CreateRestaurantRequest): Promise<Restaurant> {
    const restaurant = await this.ctx.run<Restaurant>(() =>
      this.restaurant.create(request),
    );
    await this.kafka.produce<KafkaRestaurantCreatedTopic>([restaurant]);
    return restaurant;
  }
}
