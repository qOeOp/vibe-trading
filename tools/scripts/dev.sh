#!/bin/bash
set -e

# Start development environment for Vibe Trading
# Usage: ./tools/scripts/dev.sh [up|down|logs|restart]

COMMAND="${1:-up}"

case $COMMAND in
  up)
    echo "🚀 Starting development environment..."
    docker-compose up -d kafka redis

    echo ""
    echo "⏳ Waiting for services to be ready..."
    sleep 5

    echo ""
    echo "✅ Infrastructure ready!"
    echo ""
    echo "📊 Infrastructure Status:"
    docker-compose ps kafka redis
    echo ""
    echo "🔧 Starting application services..."
    docker-compose up -d

    echo ""
    echo "✅ Development environment is running!"
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
    echo "  Kafka UI:        http://localhost:8211"
    echo "  Redis Commander: http://localhost:8212"
    echo ""
    echo "💡 Commands:"
    echo "  View logs:       ./tools/scripts/dev.sh logs [service]"
    echo "  Restart:         ./tools/scripts/dev.sh restart"
    echo "  Stop all:        ./tools/scripts/dev.sh down"
    ;;

  down)
    echo "🛑 Stopping development environment..."
    docker-compose down
    echo "✅ All services stopped!"
    ;;

  logs)
    SERVICE="${2:-}"
    if [ -z "$SERVICE" ]; then
      echo "📋 Showing logs for all services (Ctrl+C to exit)..."
      docker-compose logs -f
    else
      echo "📋 Showing logs for $SERVICE (Ctrl+C to exit)..."
      docker-compose logs -f $SERVICE
    fi
    ;;

  restart)
    echo "🔄 Restarting development environment..."
    docker-compose restart
    echo "✅ All services restarted!"
    ;;

  *)
    echo "❌ Invalid command: $COMMAND"
    echo "Usage: $0 [up|down|logs|restart]"
    exit 1
    ;;
esac
