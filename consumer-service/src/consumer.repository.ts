import { Repository } from '@ftgo/common';
import { Consumer } from '@ftgo/consumer-service-api';

export class ConsumerRepository extends Repository(Consumer) {}
