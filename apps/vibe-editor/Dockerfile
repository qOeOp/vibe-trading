# ── vibe-editor — marimo-based notebook server ──
# Build context: repo root (for potential future shared libs)
# Usage: docker build -t vibe-editor:latest -f apps/vibe-editor/Dockerfile .

FROM python:3.11-slim AS base

# Prevent .pyc files and enable unbuffered stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# ── Dependencies ──
COPY apps/vibe-editor/pyproject.toml .
RUN pip install --no-cache-dir . && \
    rm -rf /root/.cache/pip

# ── Application code ──
COPY apps/vibe-editor/ .

# Ensure vendored marimo resolves before any system-level marimo
ENV PYTHONPATH=/app

# ── Runtime ──
# Default config — override via env vars or docker-compose
ENV VIBE_EDITOR_PORT=2728 \
    VIBE_EDITOR_HOST=0.0.0.0 \
    VIBE_EDITOR_ALLOW_ORIGINS=http://localhost:4200

EXPOSE 2728

# Workspace volume — user notebooks persist here
VOLUME ["/root/.vt-lab"]

# Health check — lightweight HEAD on /health
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:2728/health')" || exit 1

CMD ["python", "main.py"]
