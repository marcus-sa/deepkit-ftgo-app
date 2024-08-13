import { createModule } from '@deepkit/app';

import { provideOrderServiceApi } from '@ftgo/order-service-api';

import { OrderController } from './order.controller';

export class OrderModule extends createModule({
  controllers: [OrderController],
  providers: [provideOrderServiceApi()],
}) {}
