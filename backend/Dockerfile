# Multi-stage build for production optimization
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# Stage 2: Production execution
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist

# Create directory for file logs
RUN mkdir -p logs

EXPOSE 5000

ENV NODE_ENV=production

CMD ["npm", "start"]
