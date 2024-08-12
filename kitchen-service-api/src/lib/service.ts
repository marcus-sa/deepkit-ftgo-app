import { RestateClient, RestateService } from 'deepkit-restate';
import { typeOf, UUID } from '@deepkit/type';

import { FactoryProvider } from '@deepkit/injector';

export interface KitchenServiceHandlers {}

export type KitchenServiceApi = RestateService<
  'Kitchen',
  KitchenServiceHandlers
>;

export function provideKitchenServiceApi(): FactoryProvider<KitchenServiceApi> {
  return {
    provide: typeOf<KitchenServiceApi>(),
    useFactory: (restate: RestateClient) =>
      restate.service<KitchenServiceApi>(),
  };
}
