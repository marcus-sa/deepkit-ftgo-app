import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { provideRestateServiceProxy, RestateModule } from 'deepkit-restate';

import { KitchenServiceApi } from '@ftgo/kitchen-service-api';
import { provideDatabase, provideReactiveEventsBus } from '@ftgo/common';

import { KitchenServiceConfig } from './config';
import { KitchenService } from './kitchen.service';
import { KitchenController } from './kitchen.controller';
import { Ticket, TicketLineItem } from './entities';
import { TicketRepository } from './ticket.repository';
import { KitchenRpcEventsBus } from './rpc-events';

void new App({
  config: KitchenServiceConfig,
  imports: [new FrameworkModule(), new RestateModule()],
  controllers: [KitchenService, KitchenController],
  providers: [
    provideDatabase([Ticket, TicketLineItem]),
    provideRestateServiceProxy<KitchenServiceApi>(),
    provideReactiveEventsBus<KitchenRpcEventsBus>(),
    TicketRepository,
  ],
})
  .loadConfigFromEnv({ prefix: '' })
  .run();
