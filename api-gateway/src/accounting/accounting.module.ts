import { createModule } from '@deepkit/app';

import { provideAccountingServiceApi } from '@ftgo/accounting-service-api';

import { AccountingController } from './accounting.controller.js';

export class AccountingModule extends createModule({
  controllers: [AccountingController],
  providers: [provideAccountingServiceApi()],
}) {}
