"""Ctrl+Relief — In-memory TTL cache for match results (Phase 1)."""

from __future__ import annotations

import hashlib
import json
import logging
import time
from typing import Any

logger = logging.getLogger("ctrl_relief")

# Default TTL: 60 seconds
_DEFAULT_TTL = 60


class MatchCache:
    """Simple in-memory cache with TTL support.

    Keys are derived from the request payload hash.
    Expired entries are lazily evicted on the next read.
    """

    def __init__(self, ttl: int = _DEFAULT_TTL) -> None:
        self._store: dict[str, tuple[float, Any]] = {}
        self._ttl = ttl
        self.hits = 0
        self.misses = 0

    # ── Key generation ───────────────────────────────────────────────────

    @staticmethod
    def _make_key(data: dict) -> str:
        """Deterministic hash of a request payload."""
        raw = json.dumps(data, sort_keys=True)
        return hashlib.sha256(raw.encode()).hexdigest()

    # ── Public API ───────────────────────────────────────────────────────

    def get(self, request_data: dict) -> Any | None:
        """Return cached value if present and not expired, else None."""
        key = self._make_key(request_data)
        entry = self._store.get(key)

        if entry is None:
            self.misses += 1
            logger.info("Cache MISS for key %s…", key[:12])
            return None

        timestamp, value = entry
        if time.time() - timestamp > self._ttl:
            # Expired — evict
            del self._store[key]
            self.misses += 1
            logger.info("Cache EXPIRED for key %s…", key[:12])
            return None

        self.hits += 1
        logger.info("Cache HIT for key %s…", key[:12])
        return value

    def put(self, request_data: dict, value: Any) -> None:
        """Store a value with the current timestamp."""
        key = self._make_key(request_data)
        self._store[key] = (time.time(), value)
        logger.info("Cache STORE key %s…", key[:12])

    @property
    def size(self) -> int:
        """Number of entries currently in the cache (including stale)."""
        return len(self._store)
