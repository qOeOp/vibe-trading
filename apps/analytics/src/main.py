"""Analytics FastAPI service."""

from fastapi import FastAPI
from .config import settings

app = FastAPI(
    title="Analytics",
    description="Vibe Trading - Data analytics and reporting",
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
        "service": "Analytics",
        "description": "Data analytics and reporting",
    }
