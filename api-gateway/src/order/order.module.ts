import { createModule } from '@deepkit/app';
import { provideRestateServiceProxy } from 'deepkit-restate';

import { OrderServiceApi } from '@ftgo/order-service-api';

import { OrderController } from './order.controller';

export class OrderModule extends createModule({
  controllers: [OrderController],
  providers: [provideRestateServiceProxy<OrderServiceApi>()],
}) {}
