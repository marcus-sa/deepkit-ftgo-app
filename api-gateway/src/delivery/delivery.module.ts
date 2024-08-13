import { createModule } from '@deepkit/app';
import { provideRestateServiceProxy } from 'deepkit-restate';

import { DeliveryServiceApi } from '@ftgo/delivery-service-api';

import { DeliveryController } from './delivery.controller';

export class DeliveryModule extends createModule({
  controllers: [DeliveryController],
  providers: [provideRestateServiceProxy<DeliveryServiceApi>()],
}) {}
