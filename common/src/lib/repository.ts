import { ClassType } from '@deepkit/core';
import {
  cast,
  ChangesInterface,
  DeepPartial,
  resolveRuntimeType,
  TypeClass,
  deserialize,
} from '@deepkit/type';
import { RestateContextStorage, RestateCustomContext } from 'deepkit-restate';
import { DatabaseQueryModel, OrmEntity } from '@deepkit/orm';

import { Database } from './database';

export class RestateRepository<E extends OrmEntity> {
  readonly #type: TypeClass;

  constructor(
    private readonly contextStorage: RestateContextStorage,
    readonly database: Database,
  ) {
    const type = resolveRuntimeType(this.constructor) as TypeClass;
    this.#type = type.extendsArguments![0] as TypeClass;
  }

  get #ctx(): Pick<RestateCustomContext, 'run'> {
    return this.contextStorage.getStore()!;
  }

  async delete(filter: DatabaseQueryModel<E>['filter']): Promise<void> {
    await this.#ctx.run(() =>
      this.database.query(this.#type.classType).filter(filter).deleteOne(),
    );
  }

  async find(filter: DatabaseQueryModel<E>['filter']): Promise<E | undefined> {
    return await this.database
      .query(this.#type.classType)
      .filter(filter)
      .findOneOrUndefined();
  }

  async save(entity: E): Promise<void> {
    await this.#ctx.run(() => this.database.persist(entity));
  }

  async patch(
    filter: DatabaseQueryModel<E>['filter'],
    changes: ChangesInterface<E> | DeepPartial<E>,
  ): Promise<E> {
    return await this.#ctx.run<E>(async () => {
      const { returning } = await this.database
        .query(this.#type.classType)
        .filter(filter)
        .patchOne(changes);
      return returning as E;
    }, this.#type);
  }

  async create(...args: ConstructorParameters<ClassType<E>>): Promise<E> {
    return await this.#ctx.run<E>(async () => {
      const et = deserialize<E>(
        new this.#type.classType(...args),
        undefined,
        undefined,
        undefined,
        this.#type,
      );
      await this.database.persist(et);
      return et;
    }, this.#type);
  }
}
