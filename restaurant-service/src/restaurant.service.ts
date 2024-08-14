import { restate, RestateServiceContext } from 'deepkit-restate';
import { CombineablePromise } from '@restatedev/restate-sdk';

import { KitchenServiceApi } from '@ftgo/kitchen-service-api';
import { OrderServiceApi } from '@ftgo/order-service-api';
import {
  CreateRestaurantRequest,
  Restaurant,
  RestaurantServiceApi,
  RestaurantServiceHandlers,
} from '@ftgo/restaurant-service-api';

import { RestaurantRepository } from './restaurant.repository';

@restate.service<RestaurantServiceApi>()
export class RestaurantService implements RestaurantServiceHandlers {
  constructor(
    private readonly restaurant: RestaurantRepository,
    private readonly kitchen: KitchenServiceApi,
    private readonly order: OrderServiceApi,
    private readonly ctx: RestateServiceContext,
  ) {}

  @restate.handler()
  async create(request: CreateRestaurantRequest): Promise<Restaurant> {
    const restaurant = (await this.restaurant.create(request)) as Restaurant;

    await CombineablePromise.all([
      this.ctx.send(this.kitchen.createMenu(restaurant)),
      this.ctx.send(this.order.createMenu(restaurant)),
    ]);

    return restaurant;
  }
}
