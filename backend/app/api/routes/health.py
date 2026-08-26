from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Request
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_session
from app.core.errors import ServiceUnavailableError
from app.core.response import ApiEnvelope, success
from app.schemas.health import HealthPayload, ServiceHealth

router = APIRouter(tags=["health"])


@router.get("/health", response_model=ApiEnvelope[HealthPayload])
def get_health(request: Request, session: Session = Depends(get_session)) -> ApiEnvelope[HealthPayload]:
    """Return the current API and SQLite health state defined by API-001."""
    try:
        session.execute(text("SELECT 1"))
    except SQLAlchemyError as exc:
        raise ServiceUnavailableError() from exc

    return success(
        HealthPayload(
            status="healthy",
            version=settings.app_version,
            checkedAt=datetime.now(timezone.utc),
            services={
                "api": ServiceHealth(status="healthy"),
                "sqlite": ServiceHealth(status="healthy"),
            },
        ),
        request.state.request_id,
    )
