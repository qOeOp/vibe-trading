# Deployment Scripts

This directory contains shell scripts for building, deploying, and managing the Vibe Trading platform.

## Build Scripts

### `build-all.sh`

Build Docker images for all services with multi-platform support.

**Usage:**
```bash
./tools/scripts/build-all.sh [registry] [tag] [push]
```

**Parameters:**
- `registry` - Docker registry URL (default: Aliyun registry)
- `tag` - Image tag (default: `latest`)
- `push` - Push to registry: `true` or `false` (default: `false`)

**Examples:**
```bash
# Local build only (native architecture)
./tools/scripts/build-all.sh

# Build and push multi-platform images (amd64 + arm64)
./tools/scripts/build-all.sh \
  crpi-8qkmcs5mqpg6052i.cn-shanghai.personal.cr.aliyuncs.com/qoeop \
  latest \
  true

# Custom registry and tag
./tools/scripts/build-all.sh myregistry.com/myproject v1.0.0 true
```

**Multi-platform Support:**
- Without `push=true`: Builds for the **host's native architecture** (e.g., `linux/arm64` on Apple Silicon) and loads to local Docker.
- With `push=true`: Builds **linux/amd64** and **linux/arm64**, pushes to registry
- First run creates a `multiplatform` builder (one-time setup)
- Subsequent builds reuse the existing builder

**Services Built:**
- `vibe-trading-web` - Next.js frontend
- `vibe-trading-api` - Express.js API gateway
- `vibe-trading-trading-engine` - Python FastAPI trading service
- `vibe-trading-market-data` - Python FastAPI market data service
- `vibe-trading-analytics` - Python FastAPI analytics service
- `vibe-trading-ml-models` - Python FastAPI ML service
- `vibe-trading-docs` - Documentation site

### `push-images.sh`

Push pre-built Docker images to registry.

**Usage:**
```bash
./tools/scripts/push-images.sh [registry] [tag]
```

**Note:** This script assumes images are already built locally. For multi-platform builds, use `build-all.sh` with `push=true` instead.

## Deployment Scripts

### `deploy.sh`

Deploy the entire platform using docker-compose.

**Usage:**
```bash
./tools/scripts/deploy.sh <mode> <tag>
```

**Modes:**
- `local-kafka` - Deploy with local Kafka cluster (for testing/development)
- `external-kafka` - Deploy with external Kafka cluster (for production)

**Examples:**
```bash
# Deploy with local Kafka
./tools/scripts/deploy.sh local-kafka latest

# Deploy with external Kafka (production)
export KAFKA_BROKERS=kafka-1:9092,kafka-2:9092
export REDIS_URL=redis://redis-host:6379
./tools/scripts/deploy.sh external-kafka v1.0.0
```

### `dev.sh`

Start development environment with docker-compose.

**Usage:**
```bash
./tools/scripts/dev.sh
```

Starts all services in development mode with hot-reloading enabled.

## Troubleshooting

### Multi-platform Build Issues

**Error: "no matching manifest for linux/amd64"**
- Your images were built on Apple Silicon (arm64) but your server needs amd64
- Solution: Use `build-all.sh` with `push=true` to build both platforms

**First build is slow**
- Initial setup creates buildx builder and downloads base images for both platforms
- Subsequent builds will be much faster due to layer caching

**"buildx: command not found"**
- Update Docker Desktop to latest version (includes buildx by default)
- Or install buildx plugin: https://github.com/docker/buildx#installing

### Docker Registry Authentication

**Push fails with "unauthorized"**
- Login to registry first: `docker login <registry-url>`
- For Aliyun: `docker login --username=<username> crpi-8qkmcs5mqpg6052i.cn-shanghai.personal.cr.aliyuncs.com`

## Best Practices

1. **Local Development**: Use `build-all.sh` without push flag for faster iteration
2. **CI/CD Pipeline**: Use `build-all.sh` with `push=true` to build and push multi-platform images
3. **Testing**: Use `deploy.sh local-kafka` to test with isolated Kafka cluster
4. **Production**: Use `deploy.sh external-kafka` with environment variables for external services
5. **Versioning**: Use semantic versioning for tags (e.g., `v1.0.0`, `v1.1.0`) instead of `latest`

## Environment Variables

### For `deploy.sh external-kafka` mode:

- `KAFKA_BROKERS` - Comma-separated list of Kafka broker addresses (required)
- `REDIS_URL` - Redis connection URL (required)
- Additional variables may be required per service (see service-specific documentation)

## Script Dependencies

- **Docker** 20.10+ with buildx support
- **Docker Compose** 2.0+
- **Bash** 4.0+
