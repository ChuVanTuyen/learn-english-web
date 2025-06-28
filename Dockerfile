# Dockerfile (ở learn-english-web)

# 1. Build SSR Angular App
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build:ssr

# 2. Run with Node.js
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist/learn-english-web ./dist/learn-english-web
COPY --from=builder /app/package.json ./package.json
RUN npm install --omit=dev

EXPOSE 4000
CMD ["node", "dist/learn-english-web/server/server.mjs"]
