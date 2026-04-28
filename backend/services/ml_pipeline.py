"""Ctrl+Relief — ML-ready pipeline placeholder (Phase 5)."""

from __future__ import annotations

import logging
from typing import Any

logger = logging.getLogger("ctrl_relief")


class MatchingModel:
    """Placeholder for a future ML-based scoring model.

    When a trained model is available, replace the ``predict`` method
    with real inference logic.  The MatchingEngine can switch between
    rule-based and ML-based scoring via the ``use_ml`` flag.
    """

    def __init__(self) -> None:
        self._is_loaded = False
        logger.info("MatchingModel initialised (placeholder mode)")

    def predict(self, features: dict[str, Any]) -> float:
        """Return a predicted match score from extracted features.

        Currently returns a simple weighted sum identical to the
        rule-based logic so the pipeline structure is exercised
        without changing outcomes.
        """
        score = (
            features.get("skill_score", 0)
            + features.get("distance_score", 0)
            + features.get("availability_score", 0)
            + features.get("urgency_score", 0)
        )
        return min(round(score), 100)
