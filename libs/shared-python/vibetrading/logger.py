"""Logging utilities for Vibe Trading services."""

import logging
import sys
from typing import Optional


def setup_logger(
    service_name: str,
    level: Optional[str] = None,
    format_string: Optional[str] = None
) -> logging.Logger:
    """
    Configure and return a logger for a service.

    Args:
        service_name: Name of the service (used in log messages)
        level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        format_string: Custom log format string

    Returns:
        Configured logger instance
    """
    if level is None:
        level = "INFO"

    if format_string is None:
        format_string = (
            f"[{service_name}] "
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )

    # Configure root logger
    logging.basicConfig(
        level=getattr(logging, level.upper()),
        format=format_string,
        handlers=[logging.StreamHandler(sys.stdout)]
    )

    logger = logging.getLogger(service_name)
    return logger


def get_logger(name: str) -> logging.Logger:
    """
    Get a logger instance.

    Args:
        name: Logger name

    Returns:
        Logger instance
    """
    return logging.getLogger(name)
