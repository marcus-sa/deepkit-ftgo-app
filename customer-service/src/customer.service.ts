import { restate, RestateEventsPublisher } from 'deepkit-restate';
import { UUID } from '@deepkit/type';

import { Money, PersonName } from '@ftgo/common';
import {
  Customer,
  CustomerCreatedEvent,
  CustomerNotFound,
  CustomerServiceApi,
  CustomerServiceHandlers,
  CustomerVerificationFailed,
} from '@ftgo/customer-service-api';

import { CustomerRepository } from './customer.repository';

@restate.service<CustomerServiceApi>()
export class CustomerService implements CustomerServiceHandlers {
  constructor(
    private readonly consumer: CustomerRepository,
    private readonly events: RestateEventsPublisher,
  ) {}

  @restate.handler()
  async create(name: PersonName): Promise<UUID> {
    const consumer = await this.consumer.create(name);
    await this.events.publish([new CustomerCreatedEvent(consumer)]);
    return consumer.id;
  }

  @restate.handler()
  async validateOrder(
    customerId: UUID,
    orderId: UUID,
    orderTotal: Money,
  ): Promise<void> {
    const consumer = await this.consumer.find({ id: customerId });
    if (!consumer) {
      throw new CustomerNotFound(customerId);
    }
    // TODO: validation
    throw new CustomerVerificationFailed(customerId);
  }
}
