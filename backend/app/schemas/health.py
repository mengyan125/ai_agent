from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class ServiceHealth(BaseModel):
    """Health state for one currently configured dependency."""

    status: Literal["healthy"]
    detail: str | None = None


class HealthPayload(BaseModel):
    """API-001 payload for the application and SQLite health check."""

    status: Literal["healthy"]
    version: str
    checkedAt: datetime
    services: dict[str, ServiceHealth]
