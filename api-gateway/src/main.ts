import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateModule } from 'deepkit-restate';

import { ApiGatewayConfig } from './config.js';
import { AccountingModule } from './accounting/accounting.module.js';
import { ConsumerModule } from './consumer/consumer.module.js';
import { DeliveryModule } from './delivery/delivery.module.js';
import { KitchenModule } from './kitchen/kitchen.module.js';
import { OrderModule } from './order/order.module.js';
import { RestaurantModule } from './restaurant/restaurant.module.js';

void new App({
  config: ApiGatewayConfig,
  imports: [
    new FrameworkModule(),
    new RestateModule(),
    new AccountingModule(),
    new ConsumerModule(),
    new DeliveryModule(),
    new KitchenModule(),
    new OrderModule(),
    new RestateModule(),
    new RestaurantModule(),
  ],
  controllers: [],
})
  .setup((module, config: ApiGatewayConfig) => {
    module.getImportedModuleByClass(FrameworkModule).configure(config.server);

    module.getImportedModuleByClass(RestateModule).configure({
      ingress: config.restate.ingress,
    });
  })
  .loadConfigFromEnv({ prefix: '' })
  .run();
