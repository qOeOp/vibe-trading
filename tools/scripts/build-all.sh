#!/bin/bash
set -e

# Build all Docker images for Vibe Trading platform
# Usage: ./tools/scripts/build-all.sh [registry] [tag]

REGISTRY="${1:-crpi-8qkmcs5mqpg6052i.cn-shanghai.personal.cr.aliyuncs.com/qoeop}"
TAG="${2:-latest}"

echo "🏗️  Building all Docker images..."
echo "Registry: $REGISTRY"
echo "Tag: $TAG"
echo ""

# Services to build
SERVICES=(
  "web"
  "api"
  "trading-engine"
  "market-data"
  "analytics"
  "ml-models"
  "docs"
)

# Build each service
for SERVICE in "${SERVICES[@]}"; do
  IMAGE_NAME="vibe-trading-${SERVICE}"
  FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:${TAG}"

  echo "📦 Building ${SERVICE}..."
  docker build \
    -f docker/${SERVICE}.Dockerfile \
    -t ${IMAGE_NAME}:${TAG} \
    -t ${IMAGE_NAME}:latest \
    -t ${FULL_IMAGE} \
    .

  echo "✅ Built ${FULL_IMAGE}"
  echo ""
done

echo "🎉 All images built successfully!"
echo ""
echo "Local images:"
docker images | grep "vibe-trading"
