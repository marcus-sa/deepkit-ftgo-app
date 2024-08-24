import { Customer } from './entities';

export class CustomerCreatedEvent {
  constructor(readonly customer: Customer) {}
}
