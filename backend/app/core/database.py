from collections.abc import Generator
from pathlib import Path

from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings


def ensure_runtime_directories() -> None:
    """Create writable runtime directories before the engine or logger is initialized."""
    settings.data_dir.mkdir(parents=True, exist_ok=True)
    settings.logs_dir.mkdir(parents=True, exist_ok=True)


def _connect_args(database_url: str) -> dict[str, object]:
    return {"check_same_thread": False} if database_url.startswith("sqlite") else {}


ensure_runtime_directories()
engine = create_engine(
    settings.resolved_database_url,
    connect_args=_connect_args(settings.resolved_database_url),
    pool_pre_ping=True,
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)


def get_session() -> Generator[Session, None, None]:
    """Yield one request-scoped SQLAlchemy session and always close it."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def database_path() -> Path | None:
    """Return the local SQLite path when configured with the default SQLite URL."""
    if settings.database_url or not settings.resolved_database_url.startswith("sqlite:///"):
        return None
    return Path(settings.resolved_database_url.removeprefix("sqlite:///"))


def run_migrations() -> None:
    """Apply the checked-in schema before serving requests so app.db is usable."""
    ensure_runtime_directories()
    alembic_config = Config(str(Path(__file__).resolve().parents[2] / "alembic.ini"))
    alembic_config.set_main_option("sqlalchemy.url", settings.resolved_database_url)
    command.upgrade(alembic_config, "head")
