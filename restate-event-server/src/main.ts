import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { RestateConfig, RestateModule } from 'deepkit-restate';
import { RestateEventServerModule } from 'deepkit-restate/event-server';

void new App({
  config: RestateConfig,
  imports: [
    new FrameworkModule(),
    new RestateModule(),
    new RestateEventServerModule(),
  ],
})
  .setup((module, config: RestateConfig) => {
    module.getImportedModuleByClass(RestateModule).configure(config);
  })
  .loadConfigFromEnv({ prefix: 'RESTATE_' })
  .run();
