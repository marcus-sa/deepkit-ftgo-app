import { Repository } from '@ftgo/shared';
import { Consumer } from '@ftgo/consumer-service-api';

export class ConsumerRepository extends Repository(Consumer) {}
