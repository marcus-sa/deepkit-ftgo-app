import { Database as OrmDatabase } from '@deepkit/orm';
import { PostgresDatabaseAdapter } from '@deepkit/postgres';
import { ClassType } from '@deepkit/core';
import { FactoryProvider } from '@deepkit/injector';

import { DatabaseConfig } from './config';

export class Database extends OrmDatabase {
  constructor(
    { user, host, password, port, name, schema }: DatabaseConfig,
    entities: ClassType[],
  ) {
    const uri = `postgres://${user}:${password}@${host}:${port}/${name}?schema=${schema}`;
    super(new PostgresDatabaseAdapter(uri), entities);
  }
}

export function provideDatabase(
  entities: ClassType[],
): FactoryProvider<Database> {
  return {
    provide: Database,
    useFactory: (config: DatabaseConfig) => new Database(config, entities),
  };
}
