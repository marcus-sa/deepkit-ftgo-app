import { http, HttpBody, HttpNotFoundError, HttpQuery } from '@deepkit/http';
import { RestateClient } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import {
  CreateOrderRequest,
  CreateOrderResponse,
  OrderServiceApi,
} from '@ftgo/order-service-api';

@http.controller('order')
export class OrderController {
  constructor(
    private readonly client: RestateClient,
    private readonly service: OrderServiceApi,
  ) {}

  @http.POST('')
  async create(
    request: HttpBody<CreateOrderRequest>,
  ): Promise<CreateOrderResponse> {}

  @http.GET(':id')
  async get(id: UUID) {
    try {
    } catch {
      throw new HttpNotFoundError();
    }
  }

  @http.POST('cancel/:id')
  async cancel(id: UUID) {}
}
