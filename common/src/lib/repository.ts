import { ClassType } from '@deepkit/core';
import {
  ChangesInterface,
  DeepPartial,
  JSONEntity,
  JSONPartial,
} from '@deepkit/type';
import {
  RestateContextStorage,
  RestateCustomContext,
  RunAction,
} from 'deepkit-restate';
import {
  Database,
  DatabaseQueryModel,
  DeleteResult,
  OrmEntity,
  PatchResult,
} from '@deepkit/orm';

export function RestateRepository<T extends OrmEntity>(
  entity: ClassType<T> & { create(data: JSONPartial<T>): T },
) {
  return class Repository {
    constructor(
      readonly contextStorage: RestateContextStorage,
      readonly database: Database,
    ) {}

    get #ctx(): Pick<RestateCustomContext, 'run'> {
      return (
        this.contextStorage.getStore() || {
          run: async (action: RunAction<any>) => action(),
        }
      );
    }

    // async findOne(filter: DatabaseQueryModel<T>['filter']): Promise<T> {
    //   return await this.database.query(entity).filter(filter).findOne();
    // }

    async delete(
      filter: DatabaseQueryModel<T>['filter'],
    ): Promise<DeleteResult<T>> {
      return await this.#ctx.run<DeleteResult<T>>(() =>
        this.database.query(entity).filter(filter).deleteOne(),
      );
    }

    // async find(filter: DatabaseQueryModel<T>['filter']): Promise<readonly T[]> {
    //   return await this.database.query(entity).filter(filter).find();
    // }

    async find(filter: DatabaseQueryModel<T>['filter']): Promise<T> {
      return await this.database.query(entity).filter(filter).findOne();
    }

    async update(
      filter: DatabaseQueryModel<T>['filter'],
      changes: ChangesInterface<T> | DeepPartial<T>,
    ): Promise<PatchResult<T>> {
      return await this.#ctx.run<PatchResult<T>>(() =>
        this.database.query(entity).filter(filter).patchOne(changes),
      );
    }

    async create(data: JSONPartial<T>): Promise<T> {
      return await this.#ctx.run<T>(async () => {
        const et = entity.create(data);
        await this.database.persist(et);
        return et;
      });
    }
  };
}
