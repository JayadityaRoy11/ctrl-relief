"""Ctrl+Relief — Feature engineering layer (Phase 6)."""

from __future__ import annotations

from typing import Any

from config import SKILL_MAP, URGENCY_BONUS, MAX_DISTANCE


def extract_features(volunteer: dict[str, Any], need_type: str, urgency: str) -> dict[str, Any]:
    """Transform raw volunteer + request data into numeric features.

    Returns a flat dict ready for either rule-based scoring or ML
    model input.
    """
    relevant_skills = SKILL_MAP.get(need_type, [])
    matched_skills = [s for s in volunteer["skills"] if s in relevant_skills]

    skill_ratio = len(matched_skills) / len(relevant_skills) if relevant_skills else 0.0
    skill_score = round(min(skill_ratio, 1.0) * 40, 2)

    distance_score = round(max(0, (1 - volunteer["distance"] / MAX_DISTANCE)) * 30, 2)

    availability_score = 15.0 if volunteer["availability"] == "full-time" else 5.0

    urgency_score = float(URGENCY_BONUS.get(urgency, 0))

    return {
        "matched_skills": matched_skills,
        "skill_ratio": round(skill_ratio, 4),
        "skill_score": skill_score,
        "distance_score": distance_score,
        "availability_score": availability_score,
        "urgency_score": urgency_score,
        "raw_distance": volunteer["distance"],
        "is_full_time": volunteer["availability"] == "full-time",
    }
