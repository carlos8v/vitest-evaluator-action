FROM node:slim

WORKDIR /app
COPY package*.json ./
RUN npm ci --silent

COPY entrypoint.sh .
COPY evaluator.ts .

RUN npm run build

WORKDIR /
RUN cp ./app/evaluator.js ./app/entrypoint.sh .
RUN rm ./app -rf

ENTRYPOINT ["/entrypoint.sh"]
