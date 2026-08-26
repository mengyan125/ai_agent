# Agent Studio API

FastAPI backend for local Agent Studio development.

## Requirements

- Python 3.11+
- uv

## Setup

```powershell
uv sync --dev
Copy-Item .env.example .env
uv run alembic upgrade head
```

`.env.example` contains local development defaults only. Do not put real API keys in this repository.

## Run

```powershell
uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The API listens on `http://localhost:8000`.

## Health check

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:8000/api/health
```

The response uses the project envelope format and includes a request ID. The default CORS origin is `http://localhost:5173`.

## Migrations

```powershell
uv run alembic upgrade head
```

The default SQLite database is created below `data/`.

## Tests

```powershell
uv run pytest -q
python -m compileall app tests
```
