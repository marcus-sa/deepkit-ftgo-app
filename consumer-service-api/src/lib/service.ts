import { RestateClient, RestateService } from 'deepkit-restate';
import { typeOf, UUID } from '@deepkit/type';

import { PersonName } from '@ftgo/common';
import { FactoryProvider } from '@deepkit/injector';

export interface ConsumerServiceHandlers {
  create(name: PersonName): Promise<UUID>;
}

export type ConsumerServiceApi = RestateService<
  'Consumer',
  ConsumerServiceHandlers
>;

export function provideConsumerServiceApi(): FactoryProvider<ConsumerServiceApi> {
  return {
    provide: typeOf<ConsumerServiceApi>(),
    useFactory: (restate: RestateClient) =>
      restate.service<ConsumerServiceApi>(),
  };
}
