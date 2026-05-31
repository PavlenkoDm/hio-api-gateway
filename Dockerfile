FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY nest-cli.json ./
COPY tsconfig*.json ./

COPY src/ ./src/

RUN npm run build


FROM node:22-alpine AS runner

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3111

CMD ["node", "dist/main"]