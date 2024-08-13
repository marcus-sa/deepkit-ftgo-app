import { http } from '@deepkit/http';
import { RestateClient } from 'deepkit-restate';

import {
  CreateRestaurantRequest,
  CreateRestaurantResponse,
  RestaurantServiceApi,
} from '@ftgo/restaurant-service-api';

@http.controller('restaurant')
export class RestaurantController {
  constructor(
    private readonly service: RestaurantServiceApi,
    private readonly client: RestateClient,
  ) {}

  @http.POST('create')
  async create(
    request: CreateRestaurantRequest,
  ): Promise<CreateRestaurantResponse> {
    const restaurant = await this.client.rpc(this.service.create(request));
    return { id: restaurant.id };
  }
}
