"""Ctrl+Relief — Data access layer for volunteer data."""

from typing import Any


# ── Dummy Volunteer Dataset ──────────────────────────────────────────────────

_VOLUNTEERS: list[dict[str, Any]] = [
    {
        "name": "Ananya Sharma",
        "skills": ["medical", "first aid", "counseling"],
        "location": "Delhi",
        "availability": "full-time",
        "distance": 3,
    },
    {
        "name": "Rohan Mehta",
        "skills": ["food", "logistics", "driving"],
        "location": "Mumbai",
        "availability": "part-time",
        "distance": 12,
    },
    {
        "name": "Priya Nair",
        "skills": ["education", "teaching", "mentoring"],
        "location": "Bangalore",
        "availability": "full-time",
        "distance": 7,
    },
    {
        "name": "Arjun Patel",
        "skills": ["food", "cooking", "distribution"],
        "location": "Ahmedabad",
        "availability": "full-time",
        "distance": 5,
    },
    {
        "name": "Sneha Iyer",
        "skills": ["medical", "nursing", "pharmacy"],
        "location": "Chennai",
        "availability": "part-time",
        "distance": 15,
    },
    {
        "name": "Kabir Singh",
        "skills": ["education", "tutoring", "curriculum design"],
        "location": "Kolkata",
        "availability": "full-time",
        "distance": 10,
    },
    {
        "name": "Meera Joshi",
        "skills": ["food", "nutrition", "logistics"],
        "location": "Pune",
        "availability": "full-time",
        "distance": 2,
    },
    {
        "name": "Dev Kulkarni",
        "skills": ["medical", "emergency response", "first aid"],
        "location": "Hyderabad",
        "availability": "part-time",
        "distance": 8,
    },
]


class VolunteerRepository:
    """Abstraction over volunteer data source.

    Currently backed by an in-memory list, but can be swapped to a
    database without changing the service layer.
    """

    def get_all_volunteers(self) -> list[dict[str, Any]]:
        """Return every volunteer record."""
        return _VOLUNTEERS
