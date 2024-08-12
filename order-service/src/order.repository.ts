import { Repository } from '@ftgo/common';
import { Order } from '@ftgo/order-service-api';

export class OrderRepository extends Repository(Order) {}
