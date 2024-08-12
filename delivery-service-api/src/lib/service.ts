import { RestateClient, RestateService } from 'deepkit-restate';
import { typeOf, UUID } from '@deepkit/type';

import { FactoryProvider } from '@deepkit/injector';

export interface DeliveryServiceHandlers {}

export type DeliveryServiceApi = RestateService<
  'Delivery',
  DeliveryServiceHandlers
>;

export function provideDeliveryServiceApi(): FactoryProvider<DeliveryServiceApi> {
  return {
    provide: typeOf<DeliveryServiceApi>(),
    useFactory: (restate: RestateClient) =>
      restate.service<DeliveryServiceApi>(),
  };
}
