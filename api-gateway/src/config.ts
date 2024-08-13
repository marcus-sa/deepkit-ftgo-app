import { RestateConfig } from 'deepkit-restate';
import { FrameworkConfig } from '@deepkit/framework';

export class ApiGatewayConfig {
  readonly restate: RestateConfig;
  readonly server: FrameworkConfig = new FrameworkConfig();
}
