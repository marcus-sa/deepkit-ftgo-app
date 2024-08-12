import { RestateClient, RestateService } from 'deepkit-restate';
import { FactoryProvider } from '@deepkit/injector';
import { typeOf } from '@deepkit/type';

import { Consumer } from '@ftgo/consumer-service-api';

export interface AccountingServiceHandlers {
  // Only required for handlers that need to be invoked directly using a Restate client
  createAccount(consumer: Consumer): Promise<void>;
}

export type AccountingServiceApi = RestateService<
  'Accounting',
  AccountingServiceHandlers
>;

export function provideAccountingServiceApi(): FactoryProvider<AccountingServiceApi> {
  return {
    provide: typeOf<AccountingServiceApi>(),
    useFactory: (restate: RestateClient) =>
      restate.service<AccountingServiceApi>(),
  };
}
