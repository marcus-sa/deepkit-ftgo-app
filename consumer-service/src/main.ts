import {App} from '@deepkit/app';
import {FrameworkModule} from '@deepkit/framework';
import {RestateModule} from 'deepkit-restate';

import {ConsumerServiceConfig} from './config';

void new App({
  config: ConsumerServiceConfig,
  imports: [new FrameworkModule(), new RestateModule()],
})
  .setup((module, config: ConsumerServiceConfig) => {
    module
      .getImportedModuleByClass(FrameworkModule)
      .configure(config.framework);

    module.getImportedModuleByClass(RestateModule).configure(config.restate);
  })
  .loadConfigFromEnv({ prefix: '' })
  .run();
