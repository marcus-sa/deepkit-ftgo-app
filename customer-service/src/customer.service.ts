import { restate, RestateEventsPublisher } from 'deepkit-restate';
import { cast, Email, float, UUID } from '@deepkit/type';

import { Money, PersonName } from '@ftgo/common';
import {
  CustomerCreatedEvent,
  CustomerServiceApi,
  CustomerServiceHandlers,
  CustomerVerificationFailed,
} from '@ftgo/customer-service-api';

import { CustomerRepository } from './customer.repository';

@restate.service<CustomerServiceApi>()
export class CustomerService implements CustomerServiceHandlers {
  constructor(
    private readonly customer: CustomerRepository,
    private readonly events: RestateEventsPublisher,
  ) {}

  @restate.handler()
  async create(name: PersonName, email: Email): Promise<UUID> {
    const customer = await this.customer.create(name, email);
    await this.events.publish<[CustomerCreatedEvent]>([
      cast<CustomerCreatedEvent>(customer),
    ]);
    return customer.id;
  }

  @restate.handler()
  async validateOrder(
    customerId: UUID,
    orderId: UUID,
    orderTotal: Money,
  ): Promise<void> {
    const consumer = await this.customer.findById(customerId);
    // TODO: validation
    throw new CustomerVerificationFailed(customerId);
  }
}
