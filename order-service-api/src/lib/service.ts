import { RestateClient, RestateService } from 'deepkit-restate';
import { typeOf, UUID } from '@deepkit/type';

import { FactoryProvider } from '@deepkit/injector';

export interface OrderServiceHandlers {}

export type OrderServiceApi = RestateService<'Order', OrderServiceHandlers>;

export function provideOrderServiceApi(): FactoryProvider<OrderServiceApi> {
  return {
    provide: typeOf<OrderServiceApi>(),
    useFactory: (restate: RestateClient) => restate.service<OrderServiceApi>(),
  };
}
