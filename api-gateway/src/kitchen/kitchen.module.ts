import { createModule } from '@deepkit/app';
import { provideRestateServiceProxy } from 'deepkit-restate';

import { KitchenServiceApi } from '@ftgo/kitchen-service-api';

import { KitchenController } from './kitchen.controller';

export class KitchenModule extends createModule({
  controllers: [KitchenController],
  providers: [provideRestateServiceProxy<KitchenServiceApi>()],
}) {}
