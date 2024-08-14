import { Consumer } from './entities';

export class ConsumerCreatedEvent {
  constructor(readonly consumer: Consumer) {}
}
