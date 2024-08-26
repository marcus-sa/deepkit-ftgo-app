import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateConfig, RestateModule } from 'deepkit-restate';
import { RestateEventsServerModule } from 'deepkit-restate/event-server';

import { RestateEventServerConfig } from './config';

void new App({
  config: RestateEventServerConfig,
  imports: [
    new FrameworkModule(),
    new RestateModule(),
    new RestateEventsServerModule(),
  ],
})
  .loadConfigFromEnv({ prefix: '' })
  .run();
