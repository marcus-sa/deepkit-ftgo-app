#!/usr/bin/env sh
kraft cloud volume create --name ftgo-redpanda --size 256

kraft cloud deploy \
  --name ftgo-redpanda \
  -M 2048 \
  -p 8081:8081/tls \
  -p 8082:8082/tls \
  -p 9092:9092/tls \
  -p 19644:9644/tls \
  -v ftgo-redpanda:/var/lib/redpanda/data \
  .
