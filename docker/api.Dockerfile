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
RUN npm install --prefer-offline --no-audit
RUN npx nx build api --prod

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built assets and node_modules
COPY --from=builder /app/dist/api ./
COPY --from=builder /app/node_modules ./node_modules

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD ["sh", "-c", "wget --quiet --tries=1 --spider http://127.0.0.1:3000/health"]

EXPOSE 3000

CMD ["node", "main.js"]
