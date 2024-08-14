import { ClassType } from '@deepkit/core';
import {ChangesInterface, DeepPartial, resolveRuntimeType, TypeClass} from '@deepkit/type';
import { RestateContextStorage, RestateCustomContext } from 'deepkit-restate';
import {
  DatabaseQueryModel,
  DeleteResult,
  OrmEntity,
  PatchResult,
} from '@deepkit/orm';

import { Database } from '@ftgo/common';

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

  async delete(
    filter: DatabaseQueryModel<E>['filter'],
  ): Promise<DeleteResult<E>> {
    return await this.#ctx.run<DeleteResult<E>>(() =>
      this.database.query(this.#type.classType).filter(filter).deleteOne(),
    );
  }

  async find(
    filter: DatabaseQueryModel<E>['filter'],
  ): Promise<E | undefined> {
    return await this.database
      .query(this.#type.classType)
      .filter(filter)
      .findOneOrUndefined();
  }

  async persist(entity: E): Promise<void> {
    await this.#ctx.run(() => this.database.persist(entity));
  }

  async patch(
    filter: DatabaseQueryModel<E>['filter'],
    changes: ChangesInterface<E> | DeepPartial<E>,
  ): Promise<PatchResult<E>> {
    return await this.#ctx.run<PatchResult<E>>(() =>
      this.database.query(this.#type.classType).filter(filter).patchOne(changes),
    );
  }

  async create(...args: ConstructorParameters<ClassType<E>>): Promise<E> {
    return await this.#ctx.run<E>(async () => {
      const et = new this.#type.classType(...args);
      await this.database.persist(et);
      return et;
    });
  }
}
