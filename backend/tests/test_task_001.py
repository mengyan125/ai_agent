from fastapi import APIRouter
from fastapi.testclient import TestClient


def test_runtime_directories_and_migration(client, app_factory):
    app, settings, database = app_factory()
    with TestClient(app):
        assert settings.data_dir.joinpath("app.db").exists()
        assert settings.logs_dir.exists()
        assert "app_metadata" in __import__("sqlalchemy").inspect(database.engine).get_table_names()


def test_request_id_and_cors(client):
    response = client.get(
        "/missing",
        headers={"Origin": "http://localhost:5173", "X-Request-ID": "fixed-id"},
    )
    assert response.headers["X-Request-ID"] == "fixed-id"
    assert response.headers["Access-Control-Allow-Origin"] == "http://localhost:5173"


def test_unhandled_exception_is_safe(client, app_factory):
    app, _, _ = app_factory()
    router = APIRouter()

    @router.get("/_test-error")
    def test_error():
        raise RuntimeError("secret sqlite:///D:/private/.env")

    app.include_router(router)
    with TestClient(app, raise_server_exceptions=False) as test_client:
        response = test_client.get("/_test-error")
    assert response.status_code == 500
    assert response.json()["code"] == 20000
    assert response.json()["data"]["errorCode"] == "INTERNAL_ERROR"
    assert "Traceback" not in response.text
    assert "sqlite:///" not in response.text
    assert "D:/" not in response.text
