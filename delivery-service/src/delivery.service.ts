import { restate } from 'deepkit-restate';

import {
  DeliveryServiceApi,
  DeliveryServiceHandlers,
} from '@ftgo/delivery-service-api';

@restate.service<DeliveryServiceApi>()
export class DeliveryService implements DeliveryServiceHandlers {}
