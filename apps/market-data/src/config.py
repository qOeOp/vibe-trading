"""Configuration for Market Data service."""

import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""

    service_name: str = "market-data"
    kafka_brokers: str = "localhost:8207"
    redis_url: str = "redis://localhost:8206"
    log_level: str = "INFO"
    port: int = 8203

    # Consul settings
    consul_host: str = "consul"
    consul_port: int = 8500
    service_host: str = "market-data"

    class Config:
        """Pydantic config."""

        env_file = ".env"
        case_sensitive = False


settings = Settings()
