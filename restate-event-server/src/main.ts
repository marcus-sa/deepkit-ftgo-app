import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateConfig, RestateModule } from 'deepkit-restate';
import { RestateEventsServerModule } from 'deepkit-restate/event-server';

void new App({
  config: RestateConfig,
  imports: [
    new FrameworkModule(),
    new RestateModule(),
    new RestateEventsServerModule(),
  ],
})
  .loadConfigFromEnv({ prefix: 'RESTATE_' })
  .run();
