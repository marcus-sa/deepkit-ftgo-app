import { RestateClient, RestateService } from 'deepkit-restate';
import { typeOf, UUID } from '@deepkit/type';

import { FactoryProvider } from '@deepkit/injector';

export interface DeliveryServiceHandlers {}

export type DeliveryServiceApi = RestateService<
  'Delivery',
  DeliveryServiceHandlers
>;
