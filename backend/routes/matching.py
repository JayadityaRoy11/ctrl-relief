"""API routes for volunteer matching endpoints."""

from __future__ import annotations

import asyncio
import time
from collections import defaultdict

from fastapi import HTTPException, Request, APIRouter
from models.schemas import (
    MatchRequest,
    MatchResponse,
    VolunteerMatch,
    HealthResponse,
    MetricsResponse,
)
from services.matching import MatchingEngine
from services.cache import MatchCache
from utils.helpers import generate_request_id
from config import (
    CACHE_TTL,
    RATE_LIMIT_MAX,
    RATE_LIMIT_WINDOW,
    QUEUE_DELAY_MS,
)

router = APIRouter()

# Initialize services
engine = MatchingEngine()
cache = MatchCache(ttl=CACHE_TTL)

# In-memory metrics
_total_requests: int = 0
_total_matches: int = 0
_response_times: list[float] = []

# Rate limiter state
_rate_buckets: dict[str, list[float]] = defaultdict(list)

# Server start time
_start_time: float = time.time()


def _check_rate_limit(client_ip: str) -> None:
    """Raise HTTP 429 if client has exceeded request quota."""
    now = time.time()
    window_start = now - RATE_LIMIT_WINDOW

    # Prune old timestamps
    _rate_buckets[client_ip] = [
        ts for ts in _rate_buckets[client_ip] if ts > window_start
    ]

    if len(_rate_buckets[client_ip]) >= RATE_LIMIT_MAX:
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded. Max {RATE_LIMIT_MAX} requests per {RATE_LIMIT_WINDOW}s.",
        )

    _rate_buckets[client_ip].append(now)


async def _process_match(request: MatchRequest, request_id: str) -> tuple[list[VolunteerMatch], str]:
    """Run matching with cache, queue delay, and return (matches, cache_status)."""

    request_data = request.model_dump()

    # Check cache
    cached = cache.get(request_data)
    if cached is not None:
        return cached, "hit"

    # Queue simulation — small async delay
    delay = QUEUE_DELAY_MS / 1000
    await asyncio.sleep(delay)

    # Compute matches
    matches = engine.rank_volunteers(request)

    # Store in cache
    cache.put(request_data, matches)

    return matches, "miss"


@router.post("/match", response_model=MatchResponse)
async def match_volunteers_v1(request: MatchRequest, raw: Request):
    """Score & rank volunteers — production route with full enrichment."""
    global _total_requests, _total_matches

    # Rate limit
    client_ip = raw.client.host if raw.client else "unknown"
    _check_rate_limit(client_ip)

    request_id = generate_request_id()

    # Timing
    t0 = time.perf_counter()

    try:
        matches, cache_status = await _process_match(request, request_id)
        elapsed_ms = round((time.perf_counter() - t0) * 1000, 2)

        _total_requests += 1
        _total_matches += len(matches)
        _response_times.append(elapsed_ms)

        return MatchResponse(
            request_id=request_id,
            processing_time_ms=elapsed_ms,
            cache_status=cache_status,
            matches=matches,
        )

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Internal server error") from exc


@router.post("/match/legacy", response_model=list[VolunteerMatch])
async def match_volunteers_legacy(request: MatchRequest, raw: Request):
    """Legacy endpoint — returns a flat list to keep frontend working."""
    global _total_requests, _total_matches

    client_ip = raw.client.host if raw.client else "unknown"
    _check_rate_limit(client_ip)

    request_id = generate_request_id()

    t0 = time.perf_counter()

    try:
        matches, cache_status = await _process_match(request, request_id)
        elapsed_ms = round((time.perf_counter() - t0) * 1000, 2)

        _total_requests += 1
        _total_matches += len(matches)
        _response_times.append(elapsed_ms)

        return matches

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Internal server error") from exc


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Detailed liveness probe with uptime and cache info."""
    return HealthResponse(
        status="ok",
        uptime_seconds=round(time.time() - _start_time, 2),
        total_requests=_total_requests,
        cache_size=cache.size,
    )


@router.get("/metrics", response_model=MetricsResponse)
async def metrics():
    """Return detailed usage and performance counters."""
    avg_ms = round(sum(_response_times) / len(_response_times), 2) if _response_times else 0.0

    return MetricsResponse(
        total_requests=_total_requests,
        total_matches_generated=_total_matches,
        cache_hits=cache.hits,
        cache_misses=cache.misses,
        average_response_time_ms=avg_ms,
    )
