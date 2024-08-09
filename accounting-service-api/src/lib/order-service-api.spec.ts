import { orderServiceApi } from './accounting-service-api';

describe('orderServiceApi', () => {
  it('should work', () => {
    expect(orderServiceApi()).toEqual('accounting-service-api');
  });
});
