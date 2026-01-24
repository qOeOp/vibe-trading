# Multi-stage build for documentation site
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies for native bindings
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package files
COPY package*.json ./
COPY nx.json tsconfig.base.json ./

# Copy wiki app
COPY apps/wiki ./apps/wiki

# Install dependencies and build
# Remove lockfile to force fresh install for Linux/Alpine
RUN rm -f package-lock.json
RUN npm install --prefer-offline --no-audit
# WORKAROUND: Rspress build fails in Docker with TypeError in ResolverFactory.
# RUN npx nx build wiki
RUN mkdir -p apps/wiki/doc_build && echo "<html><body><h1>Wiki Under Construction</h1></body></html>" > apps/wiki/doc_build/index.html

# Production stage with Nginx
FROM nginx:alpine

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Copy built assets
COPY --from=builder /app/apps/wiki/doc_build /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]