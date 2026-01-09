# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install dependencies (including devDependencies needed for build)
RUN npm install

COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
