import { RestateAdminClient, RestateClient } from 'deepkit-restate';

export const client = new RestateClient({
  url: import.meta.env.RESTATE_INGRESS_URL,
});

export const admin = new RestateAdminClient({
  url: import.meta.env.RESTATE_ADMIN_URL,
});
