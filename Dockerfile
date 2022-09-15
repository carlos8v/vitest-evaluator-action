FROM node:slim

WORKDIR /app
COPY package*.json ./
RUN npm ci --silent

COPY entrypoint.sh .
COPY src src

RUN npm run build
RUN rm src/*.ts -rf

ENTRYPOINT ["/app/entrypoint.sh"]
