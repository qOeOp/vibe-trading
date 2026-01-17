# Multi-stage build for Trading Engine service
FROM python:3.11-slim AS builder

WORKDIR /app

# Install Poetry
RUN pip install poetry==1.8.0

# Copy poetry files
COPY apps/trading-engine/pyproject.toml apps/trading-engine/poetry.lock* ./apps/trading-engine/
COPY libs/shared-python/pyproject.toml ./libs/shared-python/

# Install dependencies
WORKDIR /app/apps/trading-engine
RUN poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-ansi --no-root --only main

# Production stage
FROM python:3.11-slim

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application code
COPY apps/trading-engine/src ./src
COPY libs/shared-python/vibetrading ./vibetrading

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8001/health').read()" || exit 1

EXPOSE 8001

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8001"]
