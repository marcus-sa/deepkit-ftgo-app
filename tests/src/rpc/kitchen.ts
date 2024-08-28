import { RpcWebSocketClient } from '@deepkit/rpc';
import { KitchenRpcController } from '@ftgo/kitchen-service-api';

const client = new RpcWebSocketClient('ws://localhost:8084');

export const kitchen = client.controller<KitchenRpcController>('kitchen');
