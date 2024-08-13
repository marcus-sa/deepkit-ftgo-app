#!/usr/bin/env sh
kraft cloud volume create --name ftgo-postgres --size 256

kraft cloud deploy \
  --name ftgo-postgres \
  -M 1024 \
  -p 5432:5432/tls \
  -v ftgo-postgres:/var/lib/postgresql \
  -e POSTGRES_DATABASE=$DATABASE_NAME \
  -e POSTGRES_USER=$DATABASE_USER \
  -e POSTGRES_PASSWORD=$DATABASE_PASSWORD \
  .
