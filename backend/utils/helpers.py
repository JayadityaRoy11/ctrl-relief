"""Ctrl+Relief — Utility helpers: logging setup and ID generation."""

import logging
import uuid


def setup_logging() -> logging.Logger:
    """Configure and return the application logger."""
    logger = logging.getLogger("ctrl_relief")

    if not logger.handlers:
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            "[%(asctime)s] %(levelname)s | %(name)s | %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)

    return logger


def generate_request_id() -> str:
    """Generate a unique request identifier."""
    return str(uuid.uuid4())
