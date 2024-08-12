import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateModule } from 'deepkit-restate';

import { Order } from '@ftgo/order-service-api';
import { provideDatabase } from '@ftgo/common';

import { OrderServiceConfig } from './config';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';

void new App({
  config: OrderServiceConfig,
  imports: [new FrameworkModule(), new RestateModule()],
  controllers: [OrderController, OrderService],
  providers: [provideDatabase([Order]), OrderRepository],
})
  .setup((module, config: OrderServiceConfig) => {
    module
      .getImportedModuleByClass(FrameworkModule)
      .configure(config.framework);

    module.getImportedModuleByClass(RestateModule).configure(config.restate);
  })
  .loadConfigFromEnv({ prefix: '' })
  .run();
