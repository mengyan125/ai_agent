import logging
from logging.handlers import TimedRotatingFileHandler

from app.core.config import settings


class RequestContextFilter(logging.Filter):
    """Ensure log records always have a request ID field for structured formatting."""

    def filter(self, record: logging.LogRecord) -> bool:
        if not hasattr(record, "request_id"):
            record.request_id = "-"
        return True


def configure_logging() -> None:
    """Configure console and rotating file access logs without request payload logging."""
    settings.logs_dir.mkdir(parents=True, exist_ok=True)
    formatter = logging.Formatter(
        "%(asctime)s %(levelname)s %(name)s request_id=%(request_id)s %(message)s"
    )
    request_filter = RequestContextFilter()

    root = logging.getLogger()
    root.setLevel(logging.INFO)
    root.handlers.clear()
    for handler in (
        logging.StreamHandler(),
        TimedRotatingFileHandler(
            settings.logs_dir / "app.log", when="midnight", backupCount=7, encoding="utf-8"
        ),
    ):
        handler.setFormatter(formatter)
        handler.addFilter(request_filter)
        root.addHandler(handler)


class RequestLoggerAdapter(logging.LoggerAdapter):
    """Attach the current request ID to log entries without exposing request content."""

    def process(self, msg: str, kwargs: dict[str, object]) -> tuple[str, dict[str, object]]:
        extra = dict(kwargs.get("extra", {}))
        extra.setdefault("request_id", self.extra.get("request_id", "-"))
        kwargs["extra"] = extra
        return msg, kwargs
