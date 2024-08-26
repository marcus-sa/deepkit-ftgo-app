import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateModule } from 'deepkit-restate';

import { provideDatabase } from '@ftgo/common';

import { OrderServiceConfig } from './config';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { CancelOrderSaga, CreateOrderSaga } from './sagas';
import { Order } from './entities';

void new App({
  config: OrderServiceConfig,
  imports: [new FrameworkModule(), new RestateModule()],
  controllers: [OrderService, CreateOrderSaga, CancelOrderSaga],
  providers: [provideDatabase([Order]), OrderRepository],
})
  .loadConfigFromEnv({ prefix: '' })
  .run();
