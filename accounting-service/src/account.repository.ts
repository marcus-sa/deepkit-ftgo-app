import { RestateRepository } from '@ftgo/common';
import { Account } from '@ftgo/accounting-service-api';

export class AccountRepository extends RestateRepository(Account) {}
