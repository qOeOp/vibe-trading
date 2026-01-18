# Multi-stage build for documentation site
FROM node:20 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nx.json tsconfig.base.json ./

# Copy wiki app
COPY apps/wiki ./apps/wiki

# Install dependencies and build
RUN npm install --prefer-offline --no-audit
RUN npx nx build wiki

# Production stage with Nginx
FROM nginx:latest

# Copy nginx configuration
# We use the same nginx.conf as the web app for consistency
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Copy built assets
# Rspress build output by default is in apps/wiki/doc_build
COPY --from=builder /app/apps/wiki/doc_build /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

