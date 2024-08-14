import { UUID } from '@deepkit/type';
import { DatabaseQueryModel } from '@deepkit/orm';

import { RestateRepository } from '@ftgo/common';
import { Account, AccountNotFound } from '@ftgo/accounting-service-api';

export class AccountRepository extends RestateRepository<Account> {
  async findByConsumer(id: UUID): Promise<Account> {
    return await this.find({ consumerId: id });
  }

  override async find(
    filter: DatabaseQueryModel<Account>['filter'],
  ): Promise<Account> {
    const account = await super.find(filter);
    if (!account) {
      throw new AccountNotFound();
    }
    return account;
  }
}
