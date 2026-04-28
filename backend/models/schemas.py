"""Ctrl+Relief — Pydantic request/response schemas."""

from pydantic import BaseModel, Field
from typing import Literal, Optional


# ── Request ─────────────────────────────────────────────────────────────────

class MatchRequest(BaseModel):
    location: str = Field(
        ...,
        min_length=2,
        max_length=200,
        description="Location of the relief request",
        examples=["Mumbai", "Andheri East"],
    )
    need_type: Literal["food", "medical", "education"] = Field(
        ...,
        description="Type of need",
    )
    urgency: Literal["high", "medium", "low"] = Field(
        ...,
        description="Urgency level of the request",
    )


# ── Score Breakdown ─────────────────────────────────────────────────────────

class ScoreBreakdown(BaseModel):
    skills: float = Field(..., description="Score from skill matching (0-40)")
    distance: float = Field(..., description="Score from proximity (0-30)")
    availability: float = Field(..., description="Score from availability (0-15)")
    urgency: float = Field(..., description="Bonus from urgency level (0-15)")


# ── Single Volunteer Match ──────────────────────────────────────────────────

class VolunteerMatch(BaseModel):
    name: str
    skills: list[str]
    distance: float
    availability: str
    match_score: int
    reason: str
    score_breakdown: ScoreBreakdown


# ── Enriched Response (Phase 9) ─────────────────────────────────────────────

class MatchResponse(BaseModel):
    request_id: str = Field(..., description="Unique identifier for this request")
    processing_time_ms: float = Field(..., description="Time taken to process in milliseconds")
    cache_status: str = Field(..., description="'hit' or 'miss'")
    matches: list[VolunteerMatch]


# ── Health (Phase 10) ───────────────────────────────────────────────────────

class HealthResponse(BaseModel):
    status: str = "ok"
    uptime_seconds: Optional[float] = Field(None, description="Seconds since server start")
    total_requests: Optional[int] = Field(None, description="Requests served so far")
    cache_size: Optional[int] = Field(None, description="Entries in match cache")


# ── Metrics (Phase 4) ──────────────────────────────────────────────────────

class MetricsResponse(BaseModel):
    total_requests: int
    total_matches_generated: int
    cache_hits: int
    cache_misses: int
    average_response_time_ms: float
