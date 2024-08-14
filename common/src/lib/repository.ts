import { ClassType } from '@deepkit/core';
import { ChangesInterface, DeepPartial, JSONPartial } from '@deepkit/type';
import { RestateContextStorage, RestateCustomContext } from 'deepkit-restate';
import {
  Database,
  DatabaseQueryModel,
  DeleteResult,
  OrmEntity,
  PatchResult,
} from '@deepkit/orm';

export function RestateRepository<E extends OrmEntity>(entity: ClassType<E>) {
  return class Repository {
    constructor(
      readonly contextStorage: RestateContextStorage,
      readonly database: Database,
    ) {}

    get #ctx(): Pick<RestateCustomContext, 'run'> {
      return this.contextStorage.getStore()!;
    }

    // async findOne(filter: DatabaseQueryModel<E>['filter']): Promise<E> {
    //   return await this.database.query(entity).filter(filter).findOne();
    // }

    async delete(
      filter: DatabaseQueryModel<E>['filter'],
    ): Promise<DeleteResult<E>> {
      return await this.#ctx.run<DeleteResult<E>>(() =>
        this.database.query(entity).filter(filter).deleteOne(),
      );
    }

    // async find(filter: DatabaseQueryModel<E>['filter']): Promise<readonly E[]> {
    //   return await this.database.query(entity).filter(filter).find();
    // }

    async find(
      filter: DatabaseQueryModel<E>['filter'],
    ): Promise<E | undefined> {
      return await this.database
        .query(entity)
        .filter(filter)
        .findOneOrUndefined();
    }

    // async findOneOrUndefined(filter: DatabaseQueryModel<E>['filter']): Promise<E | undefined> {
    //   return await this.database.query(entity).filter(filter).findOneOrUndefined();
    // }

    async persist(entity: E): Promise<void> {
      await this.#ctx.run(() => this.database.persist(entity));
    }

    async patch(
      filter: DatabaseQueryModel<E>['filter'],
      changes: ChangesInterface<E> | DeepPartial<E>,
    ): Promise<PatchResult<E>> {
      return await this.#ctx.run<PatchResult<E>>(() =>
        this.database.query(entity).filter(filter).patchOne(changes),
      );
    }

    async create(...args: ConstructorParameters<ClassType<E>>): Promise<E> {
      return await this.#ctx.run<E>(async () => {
        const et = new entity(...args);
        await this.database.persist(et);
        return et;
      });
    }
  };
}
