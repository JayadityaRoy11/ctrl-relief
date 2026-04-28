"""Ctrl+Relief — Configuration loaded from environment variables with defaults."""

import os


# ── Matching Engine Settings ────────────────────────────────────────────────

MAX_DISTANCE: int = int(os.getenv("MAX_DISTANCE", "20"))
TOP_N_MATCHES: int = int(os.getenv("TOP_N_MATCHES", "3"))

# ── Skill Mapping ───────────────────────────────────────────────────────────

SKILL_MAP: dict[str, list[str]] = {
    "food": ["food", "cooking", "distribution", "nutrition", "logistics"],
    "medical": ["medical", "first aid", "nursing", "pharmacy", "emergency response", "counseling"],
    "education": ["education", "teaching", "mentoring", "tutoring", "curriculum design"],
}

URGENCY_BONUS: dict[str, int] = {"high": 15, "medium": 5, "low": 0}

# ── API Settings ────────────────────────────────────────────────────────────

API_VERSION: str = os.getenv("API_VERSION", "v1")
CORS_ORIGINS: list[str] = os.getenv("CORS_ORIGINS", "*").split(",")

# ── Cache Settings ──────────────────────────────────────────────────────────

CACHE_TTL: int = int(os.getenv("CACHE_TTL", "60"))  # seconds

# ── Rate Limiting ───────────────────────────────────────────────────────────

RATE_LIMIT_MAX: int = int(os.getenv("RATE_LIMIT_MAX", "30"))  # requests per window
RATE_LIMIT_WINDOW: int = int(os.getenv("RATE_LIMIT_WINDOW", "60"))  # seconds

# ── Processing ──────────────────────────────────────────────────────────────

QUEUE_DELAY_MS: int = int(os.getenv("QUEUE_DELAY_MS", "200"))  # simulated queue delay

# ── ML Pipeline ─────────────────────────────────────────────────────────────

USE_ML_SCORING: bool = os.getenv("USE_ML_SCORING", "false").lower() == "true"
