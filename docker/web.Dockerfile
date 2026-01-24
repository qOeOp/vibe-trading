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

# Verify build output exists
RUN echo "Checking build output..." && \
    ls -la /app/dist/apps/web/ && \
    if [ ! -f /app/dist/apps/web/.next/index.html ]; then \
      echo "ERROR: index.html not found at expected location /app/dist/apps/web/.next/index.html" && \
      echo "Build output directory contents:" && \
      find /app/dist/apps/web -type f -name "index.html" && \
      exit 1; \
    fi && \
    echo "Build verification successful"

# Production stage with Nginx
FROM nginx:alpine

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Copy built assets (Next.js static export output)
# Next.js 15 static export normally outputs to 'out/', but Nx build
# redirects to 'dist/apps/web/.next' based on project.json outputPath config
COPY --from=builder /app/dist/apps/web/.next /usr/share/nginx/html

# Verify files were copied successfully
RUN if [ ! -f /usr/share/nginx/html/index.html ]; then \
      echo "ERROR: index.html not found after copy to nginx html directory" && \
      exit 1; \
    fi && \
    echo "Nginx static files copied successfully"

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD ["sh", "-c", "wget --quiet --tries=1 --spider http://127.0.0.1/health"]

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]