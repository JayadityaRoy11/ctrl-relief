"""Ctrl+Relief — FastAPI application entry point.

Production-grade with caching, rate limiting, timing, metrics,
queue simulation, and enriched responses.  All legacy endpoints preserved.
"""

from __future__ import annotations

import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import CORS_ORIGINS, API_VERSION
from utils.helpers import setup_logging
from routes.matching import router as matching_router

# ── Bootstrap ───────────────────────────────────────────────────────────────

logger = setup_logging()

app = FastAPI(
    title="Ctrl+Relief API",
    version="3.0.0",
    description="AI-powered disaster response volunteer matching engine",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Include routes ─────────────────────────────────────────────────────────────

app.include_router(matching_router, prefix=f"/api/{API_VERSION}")

# ── Legacy route support ───────────────────────────────────────────────────────
# Include the legacy endpoints for backward compatibility
app.include_router(matching_router, prefix="/api")

# ── Server start time ─────────────────────────────────────────────────────────

_start_time: float = time.time()

# ── Root endpoint ───────────────────────────────────────────────────────────────

@app.get("/")
async def root():
    """API root with basic info."""
    return {
        "name": "Ctrl+Relief API",
        "version": "3.0.0",
        "description": "AI-powered disaster response volunteer matching engine",
        "docs": "/docs",
        "health": "/health",
        "uptime_seconds": round(time.time() - _start_time, 2),
    }
