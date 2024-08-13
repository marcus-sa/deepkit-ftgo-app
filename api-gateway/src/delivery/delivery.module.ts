import { createModule } from '@deepkit/app';

import { provideDeliveryServiceApi } from '@ftgo/delivery-service-api';

import { DeliveryController } from './delivery.controller';

export class DeliveryModule extends createModule({
  controllers: [DeliveryController],
  providers: [provideDeliveryServiceApi()],
}) {}
