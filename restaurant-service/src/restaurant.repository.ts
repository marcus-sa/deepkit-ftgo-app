import { Repository } from '@ftgo/common';
import { Restaurant } from '@ftgo/restaurant-service-api';

export class RestaurantRepository extends Repository(Restaurant) {}
