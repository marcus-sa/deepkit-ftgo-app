import { FrameworkConfig } from '@deepkit/framework';

import { DatabaseConfig, RestateConfig } from '@ftgo/shared';

export class ConsumerServiceConfig {
  readonly database: DatabaseConfig;
  readonly restate: RestateConfig;
  readonly framework?: FrameworkConfig;
}
