from typing import Any, Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class ApiEnvelope(BaseModel, Generic[T]):
    """Stable response wrapper shared by all API success and error responses."""

    code: int
    message: str
    data: T
    requestId: str


class ApiErrorData(BaseModel):
    """Safe machine-readable error category exposed to API clients."""

    errorCode: str


def success(data: T, request_id: str, message: str = "OK") -> ApiEnvelope[T]:
    """Build a successful API envelope preserving the request correlation ID."""
    return ApiEnvelope(code=0, message=message, data=data, requestId=request_id)
