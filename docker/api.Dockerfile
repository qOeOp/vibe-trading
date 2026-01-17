# Multi-stage build for API service
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nx.json tsconfig.base.json ./

# Copy API app and shared libraries
COPY apps/api ./apps/api
COPY libs/shared-types ./libs/shared-types

# Install dependencies and build
RUN npm ci --prefer-offline --no-audit
RUN npx nx build api --prod

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built assets and node_modules
COPY --from=builder /app/dist/apps/api ./
COPY --from=builder /app/node_modules ./node_modules

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

EXPOSE 3000

CMD ["node", "main.js"]
