#!/bin/bash
set -e

# Build all Docker images for Vibe Trading platform
# Usage: ./tools/scripts/build-all.sh [registry] [tag] [push]
# Example: ./tools/scripts/build-all.sh myregistry latest true

REGISTRY="${1:-crpi-8qkmcs5mqpg6052i.cn-shanghai.personal.cr.aliyuncs.com/qoeop}"
TAG="${2:-latest}"
PUSH="${3:-false}"

echo "🏗️  Building all Docker images..."
echo "Registry: $REGISTRY"
echo "Tag: $TAG"
echo ""

# Create buildx builder if it doesn't exist
if ! docker buildx ls | grep -q "multiplatform"; then
  echo "📦 Creating multiplatform builder..."
  docker buildx create --name multiplatform --use
  docker buildx inspect --bootstrap
  echo ""
fi

# Use multiplatform builder
docker buildx use multiplatform
echo "✅ Using multiplatform builder"
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

  # Build command with conditional push
  if [ "$PUSH" = "true" ]; then
    echo "📦 Building and pushing ${SERVICE} for linux/amd64 and linux/arm64..."
    docker buildx build \
      --platform linux/amd64,linux/arm64 \
      -f docker/${SERVICE}.Dockerfile \
      -t ${FULL_IMAGE} \
      -t ${REGISTRY}/${IMAGE_NAME}:latest \
      --push \
      .
    echo "✅ Built and pushed ${FULL_IMAGE} and ${REGISTRY}/${IMAGE_NAME}:latest (amd64 + arm64)"
  else
    echo "📦 Building ${SERVICE} for native platform (local only)..."
    docker buildx build \
      -f docker/${SERVICE}.Dockerfile \
      -t ${IMAGE_NAME}:${TAG} \
      -t ${IMAGE_NAME}:latest \
      -t ${FULL_IMAGE} \
      --load \
      .
    echo "✅ Built ${FULL_IMAGE} (native only, loaded locally)"
    echo "💡 Use './tools/scripts/build-all.sh ${REGISTRY} ${TAG} true' to build and push multi-platform images"
  fi
  echo ""
done

echo "🎉 All images built successfully!"
echo ""
if [ "$PUSH" = "false" ]; then
  echo "Local images:"
  docker images | grep "vibe-trading"
fi
