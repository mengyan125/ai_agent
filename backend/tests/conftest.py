import importlib
from pathlib import Path

import pytest
from fastapi import APIRouter
from fastapi.testclient import TestClient


@pytest.fixture()
def app_factory(monkeypatch: pytest.MonkeyPatch, tmp_path: Path):
    """Build an isolated application using a temporary SQLite data directory."""
    monkeypatch.setenv("DATA_DIR", str(tmp_path / "data"))
    monkeypatch.delenv("DATABASE_URL", raising=False)
    monkeypatch.setenv("CORS_ORIGINS", '["http://localhost:5173"]')

    import app.core.config as config_module
    import app.core.database as database_module
    import app.main as main_module

    importlib.reload(config_module)
    importlib.reload(database_module)
    importlib.reload(main_module)

    def build():
        return main_module.create_app(), config_module.settings, database_module

    yield build


@pytest.fixture()
def client(app_factory):
    """Provide a TestClient whose lifespan prepares temporary runtime directories."""
    app, _, _ = app_factory()
    with TestClient(app, raise_server_exceptions=False) as test_client:
        yield test_client


@pytest.fixture()
def test_router():
    """Create an isolated router for error-handler tests without product endpoints."""
    return APIRouter()
