import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { provideRestateServiceProxy, RestateModule } from 'deepkit-restate';

import { KitchenServiceApi } from '@ftgo/kitchen-service-api';
import { ConsumerServiceApi } from '@ftgo/consumer-service-api';
import { AccountingServiceApi } from '@ftgo/accounting-service-api';
import { Order } from '@ftgo/order-service-api';
import { provideDatabase } from '@ftgo/common';

import { OrderServiceConfig } from './config';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { CancelOrderSaga, CreateOrderSaga } from './sagas';

void new App({
  config: OrderServiceConfig,
  imports: [new FrameworkModule(), new RestateModule()],
  controllers: [OrderService, CreateOrderSaga, CancelOrderSaga],
  providers: [
    provideDatabase([Order]),
    OrderRepository,
    provideRestateServiceProxy<ConsumerServiceApi>(),
    provideRestateServiceProxy<KitchenServiceApi>(),
    provideRestateServiceProxy<AccountingServiceApi>(),
  ],
})
  .setup((module, config: OrderServiceConfig) => {
    module
      .getImportedModuleByClass(FrameworkModule)
      .configure(config.framework);

    module.getImportedModuleByClass(RestateModule).configure(config.restate);
  })
  .loadConfigFromEnv({ prefix: '' })
  .run();
