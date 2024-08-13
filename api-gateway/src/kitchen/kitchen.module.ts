import { createModule } from '@deepkit/app';

import { provideKitchenServiceApi } from '@ftgo/kitchen-service-api';

import { KitchenController } from './kitchen.controller';

export class KitchenModule extends createModule({
  controllers: [KitchenController],
  providers: [provideKitchenServiceApi()],
}) {}
