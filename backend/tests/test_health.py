from datetime import datetime

from fastapi.testclient import TestClient
from sqlalchemy.exc import OperationalError

from app.core.database import get_session


def test_health_returns_api_001_envelope(client, app_factory):
    app, settings, database = app_factory()
    with TestClient(app, raise_server_exceptions=False) as test_client:
        response = test_client.get("/api/health")

    assert response.status_code == 200
    body = response.json()
    assert body["code"] == 0
    assert body["message"] == "OK"
    assert body["requestId"]
    assert body["data"]["status"] == "healthy"
    assert body["data"]["version"] == settings.app_version
    assert datetime.fromisoformat(body["data"]["checkedAt"].replace("Z", "+00:00")).tzinfo is not None
    assert body["data"]["services"] == {
        "api": {"status": "healthy", "detail": None},
        "sqlite": {"status": "healthy", "detail": None},
    }
    assert settings.data_dir.joinpath("app.db").exists()
    database.engine.dispose()


def test_health_maps_sqlite_failure_to_safe_service_unavailable(app_factory):
    app, _, _ = app_factory()

    class BrokenSession:
        def execute(self, _statement):
            raise OperationalError("SELECT 1", {}, RuntimeError("sqlite:///D:/private/.env"))

        def close(self):
            pass

    def get_broken_session():
        yield BrokenSession()

    app.dependency_overrides[get_session] = get_broken_session
    with TestClient(app, raise_server_exceptions=False) as test_client:
        response = test_client.get("/api/health")

    assert response.status_code == 503
    assert response.json() == {
        "code": 20001,
        "message": "Service is unavailable",
        "data": {"errorCode": "SERVICE_UNAVAILABLE"},
        "requestId": response.headers["X-Request-ID"],
    }
    assert "Traceback" not in response.text
    assert "sqlite:///" not in response.text
    assert "D:/" not in response.text
    assert ".env" not in response.text


def test_health_propagates_request_id_and_cors(client):
    response = client.get(
        "/api/health",
        headers={"Origin": "http://localhost:5173", "X-Request-ID": "health-request-id"},
    )

    assert response.status_code == 200
    assert response.headers["Access-Control-Allow-Origin"] == "http://localhost:5173"
    assert response.headers["X-Request-ID"] == "health-request-id"
    assert response.json()["requestId"] == "health-request-id"


def test_docs_and_openapi_remain_available(client):
    assert client.get("/docs").status_code == 200
    openapi = client.get("/openapi.json")
    assert openapi.status_code == 200
    assert "/api/health" in openapi.json()["paths"]
