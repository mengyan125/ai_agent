from dataclasses import dataclass


@dataclass(slots=True)
class AppError(Exception):
    """Expected application error that can be safely represented to API clients."""

    message: str
    error_code: str
    status_code: int
    code: int


class ServiceUnavailableError(AppError):
    """Raised when a required local infrastructure dependency is unavailable."""

    def __init__(self, message: str = "Service is unavailable") -> None:
        super().__init__(message, "SERVICE_UNAVAILABLE", 503, 20001)
