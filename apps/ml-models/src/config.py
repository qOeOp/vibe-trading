"""Configuration for ML Models service."""

import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""

    service_name: str = "ml-models"
    kafka_brokers: str = "localhost:8207"
    redis_url: str = "redis://localhost:8206"
    log_level: str = "INFO"
    port: int = 8205

    class Config:
        """Pydantic config."""

        env_file = ".env"
        case_sensitive = False


settings = Settings()
