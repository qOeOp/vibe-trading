"""Trading Engine FastAPI service."""

from fastapi import FastAPI
from .config import settings

app = FastAPI(
    title="Trading Engine",
    description="Vibe Trading - Trading algorithms and strategy execution",
    version="0.1.0",
)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": settings.service_name,
        "version": "0.1.0",
    }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": "Trading Engine",
        "description": "Trading algorithms and strategy execution",
    }
