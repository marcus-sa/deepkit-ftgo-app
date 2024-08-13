#!/usr/bin/env sh
kraft cloud volume create --name ftgo-restate --size 256
# TODO: need redpanda broker host
kraft cloud deploy --name ftgo-restate -M 512 -v ftgo-restate:/var/lib/restate -e RESTATE_CONFIG=/etc/config/restate.toml -p 8080:8080/tls -p 9070:9070/tls .
