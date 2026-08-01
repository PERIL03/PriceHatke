# Multi-stage production Dockerfile for PriceHatke NestJS API

# Stage 1: Build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package descriptors
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client & build NestJS app
RUN npx prisma generate
RUN npm run build

# Prune devDependencies for lightweight production runner
RUN npm prune --production

# Stage 2: Production runner stage
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Copy package descriptors, prisma configuration, and tsconfig
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
COPY tsconfig.json ./

# Copy pruned node_modules and compiled dist from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
