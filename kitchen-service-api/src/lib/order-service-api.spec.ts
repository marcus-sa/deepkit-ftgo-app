import { orderServiceApi } from './kitchen-service-api';

describe('orderServiceApi', () => {
  it('should work', () => {
    expect(orderServiceApi()).toEqual('kitchen-service-api');
  });
});
