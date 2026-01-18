# Multi-stage build for web frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nx.json tsconfig.base.json ./

# Copy web app
COPY apps/web ./apps/web
COPY libs/shared-types ./libs/shared-types

# Install dependencies and build
RUN npm install --prefer-offline --no-audit
RUN npx nx build web --prod

# Production stage with Nginx
FROM nginx:alpine

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Copy built assets
COPY --from=builder /app/dist/web /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD ["sh", "-c", "wget --quiet --tries=1 --spider http://127.0.0.1/health"]

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
