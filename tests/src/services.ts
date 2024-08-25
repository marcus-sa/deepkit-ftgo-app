import { CustomerServiceApi } from '@ftgo/customer-service-api';
import { OrderServiceApi } from '@ftgo/order-service-api';
import { DeliveryServiceApi } from '@ftgo/delivery-service-api';
import { KitchenServiceApi } from '@ftgo/kitchen-service-api';
import { PaymentServiceApi } from '@ftgo/payment-service-api';
import { RestaurantServiceApi } from '@ftgo/restaurant-service-api';

import { client } from './clients';

export const customer = client.service<CustomerServiceApi>();
export const delivery = client.service<DeliveryServiceApi>();
export const kitchen = client.service<KitchenServiceApi>();
export const order = client.service<OrderServiceApi>();
export const payment = client.service<PaymentServiceApi>();
export const restaurant = client.service<RestaurantServiceApi>();
