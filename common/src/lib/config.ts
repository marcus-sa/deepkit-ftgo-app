import { integer } from '@deepkit/type';
import { RestateConfig } from 'deepkit-restate';
import { FrameworkConfig } from '@deepkit/framework';

export class DatabaseConfig {
  readonly host: string;
  readonly name: string;
  readonly user: string;
  readonly password: string;
  readonly schema: string;
  readonly port: integer;
}

export class ServiceConfig {
  readonly database: DatabaseConfig;
  readonly restate: RestateConfig;
  readonly framework?: FrameworkConfig;
}
