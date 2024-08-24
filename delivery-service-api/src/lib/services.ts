import { RestateService } from 'deepkit-restate';

export interface DeliveryServiceHandlers {}

export type DeliveryServiceApi = RestateService<
  'Delivery',
  DeliveryServiceHandlers
>;
