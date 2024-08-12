import { http } from '@deepkit/http';
import { RestateClient } from 'deepkit-restate';

import {
  CreateRestaurantRequest,
  CreateRestaurantResponse,
  Restaurant,
  RestaurantServiceApi,
} from '@ftgo/restaurant-service-api';

@http.controller('')
export class RestaurantController {
  constructor(
    private readonly service: RestaurantServiceApi,
    private readonly restate: RestateClient,
  ) {}

  @http.POST('create')
  async create(
    request: CreateRestaurantRequest,
  ): Promise<CreateRestaurantResponse> {
    const restaurant = await this.restate.rpc(this.service.create(request));
    return { id: restaurant.id };
  }
}
