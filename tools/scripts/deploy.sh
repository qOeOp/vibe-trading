#!/bin/bash
set -e

# Deploy Vibe Trading platform with Docker Compose
# Usage: ./tools/scripts/deploy.sh [local-kafka|external-kafka] [tag]
#
# Modes:
#   local-kafka     - Run with local Kafka/Zookeeper in containers
#   external-kafka  - Connect to external Kafka (requires KAFKA_BROKERS env var)

MODE="${1:-local-kafka}"
TAG="${2:-latest}"

echo "🚀 Deploying Vibe Trading Platform"
echo "Mode: $MODE"
echo "Tag: $TAG"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "📝 Creating .env from .env.example..."
  cp .env.example .env
fi

# Export environment variables
export IMAGE_TAG=$TAG
export DOCKER_REGISTRY=${DOCKER_REGISTRY:-crpi-8qkmcs5mqpg6052i.cn-shanghai.personal.cr.aliyuncs.com/qoeop}

if [ "$MODE" = "local-kafka" ]; then
  echo "🔧 Deploying with local Kafka..."
  docker-compose -f docker-compose.prod.yml --profile local-kafka up -d

  echo ""
  echo "⏳ Waiting for Kafka to be ready..."
  sleep 10

elif [ "$MODE" = "external-kafka" ]; then
  if [ -z "$KAFKA_BROKERS" ]; then
    echo "❌ Error: KAFKA_BROKERS environment variable is required for external-kafka mode"
    echo "Example: export KAFKA_BROKERS=your-kafka-host:9092"
    exit 1
  fi

  echo "🔧 Deploying with external Kafka: $KAFKA_BROKERS"
  docker-compose -f docker-compose.prod.yml up -d

else
  echo "❌ Invalid mode: $MODE"
  echo "Usage: $0 [local-kafka|external-kafka] [tag]"
  exit 1
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Service Status:"
docker-compose -f docker-compose.prod.yml ps
echo ""
echo "🌐 Services available at:"
echo "  Frontend:        http://localhost:8200"
echo "  API:             http://localhost:8201/health"
echo "  Trading Engine:  http://localhost:8202/health"
echo "  Market Data:     http://localhost:8203/health"
echo "  Analytics:       http://localhost:8204/health"
echo "  ML Models:       http://localhost:8205/health"
echo ""
echo "🔍 Observability:"
echo "  Portainer:       http://localhost:8210"
if [ "$MODE" = "local-kafka" ]; then
  echo "  Kafka UI:        http://localhost:8211"
fi
echo "  Redis Commander: http://localhost:8212"
echo ""
echo "📋 View logs: docker-compose -f docker-compose.prod.yml logs -f [service]"
echo "🛑 Stop all:  docker-compose -f docker-compose.prod.yml down"
