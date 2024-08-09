import { integer } from '@deepkit/type';

export class DatabaseConfig {
  readonly host: string;
  readonly name: string;
  readonly user: string;
  readonly password: string;
  readonly port: integer;
}

export class RestateConfig {
  readonly host: string;
  readonly port: string;
  readonly adminPort: integer;
  readonly ingressPort: integer;
}
