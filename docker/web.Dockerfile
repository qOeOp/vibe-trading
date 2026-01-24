# Multi-stage build for web frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and root configs
COPY package*.json ./
COPY nx.json tsconfig.base.json eslint.config.mjs .nxignore ./

# Copy web app and shared libs
COPY apps/web ./apps/web
COPY libs/shared-types ./libs/shared-types

# Install dependencies and build
RUN npm install --prefer-offline --no-audit
RUN npx nx build web --prod

# Production stage with Nginx
FROM nginx:alpine

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Copy built assets (Next.js static export output)
# Note: Next.js 15 'output: export' puts files in .next by default in this workspace setup
COPY --from=builder /app/dist/apps/web/.next /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD ["sh", "-c", "wget --quiet --tries=1 --spider http://127.0.0.1/health"]

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]