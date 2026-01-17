"""Market Data FastAPI service."""

from fastapi import FastAPI
from .config import settings

app = FastAPI(
    title="Market Data",
    description="Vibe Trading - Market data processing and distribution",
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
        "service": "Market Data",
        "description": "Market data processing and distribution",
    }
