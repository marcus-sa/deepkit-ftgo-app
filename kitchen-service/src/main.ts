import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateModule } from 'deepkit-restate';

import { provideDatabase } from '@ftgo/common';
import { Ticket, TicketLineItem } from '@ftgo/kitchen-service-api';

import { KitchenServiceConfig } from './config';
import { KitchenRepository } from './kitchen.repository';
import { KitchenService } from './kitchen.service';
import { TicketRepository } from './ticket.repository';

void new App({
  config: KitchenServiceConfig,
  imports: [new FrameworkModule(), new RestateModule()],
  controllers: [KitchenService],
  providers: [provideDatabase([Ticket, TicketLineItem]), TicketRepository],
})
  .loadConfigFromEnv({ prefix: '' })
  .run();
