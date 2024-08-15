import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateModule } from 'deepkit-restate';

import { ApiGatewayConfig } from './config';
import { AccountingModule } from './accounting';
import { ConsumerModule } from './consumer';
import { DeliveryModule } from './delivery';
import { KitchenModule } from './kitchen';
import { OrderModule } from './order';
import { RestaurantModule } from './restaurant';

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
})
  .loadConfigFromEnv({ prefix: '' })
  .run();
