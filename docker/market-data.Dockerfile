# Multi-stage build for Market Data service
FROM python:3.11-slim AS builder

WORKDIR /app

# Install Poetry
RUN pip install poetry==1.8.0

# Copy poetry files
COPY apps/market-data/pyproject.toml apps/market-data/poetry.lock* ./apps/market-data/
COPY libs/shared-python/pyproject.toml ./libs/shared-python/

# Install dependencies
WORKDIR /app/apps/market-data
RUN poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-ansi --no-root --only main

# Production stage
FROM python:3.11-slim

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application code
COPY apps/market-data/src ./src
COPY libs/shared-python/vibetrading ./vibetrading

# Add healthcheck (use 127.0.0.1 for IPv4 reliability per CLAUDE.md guidelines)
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8002/health').read()" || exit 1

EXPOSE 8002

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8002"]
