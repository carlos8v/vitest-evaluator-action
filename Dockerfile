FROM node:slim as builder

WORKDIR /build
COPY package*.json ./
RUN npm ci --silent

COPY src/ src/
RUN npm run build
RUN rm src -rf

FROM node:slim

WORKDIR /
COPY --from=builder --chown=node:node /build/evaluator/ .
COPY entrypoint.sh .

ENTRYPOINT ["/entrypoint.sh"]
