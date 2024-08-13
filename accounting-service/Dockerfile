FROM oven/bun:1 AS deps
WORKDIR /usr/src
COPY ../package.json .
RUN bun install --production

FROM scratch
ENV NODE_ENV production
COPY --from=deps /usr/src/node_modules /usr/src/node_modules
COPY ../dist/accounting-service/main.mjs /usr/src/server.mjs

CMD ["/usr/bin/node", "/usr/src/server.mjs", "server:start"]
