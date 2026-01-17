"""ML Models FastAPI service."""

from fastapi import FastAPI
from .config import settings

app = FastAPI(
    title="ML Models",
    description="Vibe Trading - Machine learning predictions and model serving",
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
        "service": "ML Models",
        "description": "Machine learning predictions and model serving",
    }
