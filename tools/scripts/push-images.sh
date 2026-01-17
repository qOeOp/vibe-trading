#!/bin/bash
set -e

# Push all Docker images to registry
# Usage: ./tools/scripts/push-images.sh [registry] [tag]

REGISTRY="${1:-crpi-8qkmcs5mqpg6052i.cn-shanghai.personal.cr.aliyuncs.com/qoeop}"
TAG="${2:-latest}"

echo "📤 Pushing all Docker images to registry..."
echo "Registry: $REGISTRY"
echo "Tag: $TAG"
echo ""

# Services to push
SERVICES=(
  "web"
  "api"
  "trading-engine"
  "market-data"
  "analytics"
  "ml-models"
)

# Push each service
for SERVICE in "${SERVICES[@]}"; do
  IMAGE_NAME="vibe-trading-${SERVICE}"
  FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:${TAG}"

  echo "⬆️  Pushing ${SERVICE}..."
  docker push ${FULL_IMAGE}

  echo "✅ Pushed ${FULL_IMAGE}"
  echo ""
done

echo "🎉 All images pushed successfully!"
