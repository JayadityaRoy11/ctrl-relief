"""Ctrl+Relief — Matching engine: scores and ranks volunteers."""

from __future__ import annotations

import logging
from typing import Any

from config import TOP_N_MATCHES, USE_ML_SCORING
from models.schemas import MatchRequest, VolunteerMatch, ScoreBreakdown
from services.repository import VolunteerRepository
from services.features import extract_features
from services.ml_pipeline import MatchingModel

logger = logging.getLogger("ctrl_relief")


class MatchingEngine:
    """Score volunteers against a relief request and return the best matches.

    Supports two scoring paths:
      - Rule-based (default): deterministic weighted scoring
      - ML-based: delegates to MatchingModel.predict() (placeholder)
    """

    def __init__(
        self,
        repository: VolunteerRepository | None = None,
        use_ml: bool = USE_ML_SCORING,
    ) -> None:
        self._repo = repository or VolunteerRepository()
        self._use_ml = use_ml
        self._ml_model = MatchingModel() if use_ml else None
        logger.info("MatchingEngine ready (ml=%s)", self._use_ml)

    # ── Score a single volunteer ─────────────────────────────────────────

    def compute_match(
        self, volunteer: dict[str, Any], request: MatchRequest
    ) -> VolunteerMatch | None:
        """Score one volunteer. Returns None if skills don't overlap."""

        # Phase 6: Feature extraction
        features = extract_features(volunteer, request.need_type, request.urgency)

        if not features["matched_skills"]:
            return None

        # Phase 5: Scoring path selection
        if self._use_ml and self._ml_model:
            total = self._ml_model.predict(features)
        else:
            total = round(
                features["skill_score"]
                + features["distance_score"]
                + features["availability_score"]
                + features["urgency_score"]
            )
            total = min(total, 100)

        # Human-readable reason
        reason_parts: list[str] = []
        matched_skills = features["matched_skills"]
        if matched_skills:
            reason_parts.append(f"{', '.join(matched_skills)} experience")
        if volunteer["distance"] <= 5:
            reason_parts.append("close proximity")
        elif volunteer["distance"] <= 10:
            reason_parts.append("moderate proximity")
        if volunteer["availability"] == "full-time":
            reason_parts.append("full-time availability")
        if request.urgency == "high":
            reason_parts.append("high-urgency boost applied")

        reason = "Selected because of " + ", ".join(reason_parts) + "."

        return VolunteerMatch(
            name=volunteer["name"],
            skills=volunteer["skills"],
            distance=volunteer["distance"],
            availability=volunteer["availability"],
            match_score=total,
            reason=reason,
            score_breakdown=ScoreBreakdown(
                skills=features["skill_score"],
                distance=features["distance_score"],
                availability=features["availability_score"],
                urgency=features["urgency_score"],
            ),
        )

    # ── Rank all volunteers and return top N ─────────────────────────────

    def rank_volunteers(self, request: MatchRequest) -> list[VolunteerMatch]:
        """Score every volunteer, sort descending, and return top N."""

        results: list[VolunteerMatch] = []
        for vol in self._repo.get_all_volunteers():
            match = self.compute_match(vol, request)
            if match:
                results.append(match)

        results.sort(key=lambda v: v.match_score, reverse=True)

        top = results[:TOP_N_MATCHES]
        logger.info(
            "Ranked %d candidates → returning top %d", len(results), len(top)
        )
        return top
