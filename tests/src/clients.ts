import { RestateAdminClient, RestateClient } from 'deepkit-restate';

export const client = new RestateClient({
  url: 'http://0.0.0.0:8080',
});

export const admin = new RestateAdminClient({
  url: 'http://0.0.0.0:9070',
});
