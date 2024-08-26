import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateModule } from 'deepkit-restate';

import { provideDatabase } from '@ftgo/common';

import { KitchenServiceConfig } from './config';
import { KitchenService } from './kitchen.service';
import { TicketRepository } from './ticket.repository';
import { Ticket, TicketLineItem } from './entities';

void new App({
  config: KitchenServiceConfig,
  imports: [new FrameworkModule(), new RestateModule()],
  controllers: [KitchenService],
  providers: [provideDatabase([Ticket, TicketLineItem]), TicketRepository],
})
  .loadConfigFromEnv({ prefix: '' })
  .run();
