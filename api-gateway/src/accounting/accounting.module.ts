import { createModule } from '@deepkit/app';
import { provideRestateServiceProxy } from 'deepkit-restate';

import { PaymentServiceApi } from '@ftgo/payment-service-api';

import { AccountingController } from './accounting.controller';

export class AccountingModule extends createModule({
  controllers: [AccountingController],
  providers: [provideRestateServiceProxy<PaymentServiceApi>()],
}) {}
