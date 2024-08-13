import { createModule } from '@deepkit/app';
import { provideRestateServiceProxy } from 'deepkit-restate';

import { AccountingServiceApi } from '@ftgo/accounting-service-api';

import { AccountingController } from './accounting.controller';

export class AccountingModule extends createModule({
  controllers: [AccountingController],
  providers: [provideRestateServiceProxy<AccountingServiceApi>()],
}) {}
