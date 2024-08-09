import { orderServiceApi } from './restaurant-service-api';

describe('orderServiceApi', () => {
  it('should work', () => {
    expect(orderServiceApi()).toEqual('restaurant-service-api');
  });
});
