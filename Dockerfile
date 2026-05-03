FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
WORKDIR /app/client
RUN npm install
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY server ./server
COPY --from=builder /app/client/build ./client/build
ENV PORT=8080
EXPOSE 8080
CMD ["node", "server/index.js"]