from __future__ import annotations

import logging
import time
import uuid
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.api.router import router as api_router
from app.core.config import settings
from app.core.database import ensure_runtime_directories, run_migrations
from app.core.errors import AppError
from app.core.logging import RequestLoggerAdapter, configure_logging
from app.core.response import ApiEnvelope, ApiErrorData

logger = logging.getLogger(__name__)


class RequestIdMiddleware(BaseHTTPMiddleware):
    """Propagate client supplied request IDs or assign a UUID for correlation."""

    async def dispatch(self, request: Request, call_next):  # type: ignore[no-untyped-def]
        request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        request.state.request_id = request_id
        started_at = time.perf_counter()
        response = None
        try:
            response = await call_next(request)
            return response
        finally:
            status_code = response.status_code if response is not None else 500
            duration_ms = round((time.perf_counter() - started_at) * 1000, 2)
            RequestLoggerAdapter(logger, {"request_id": request_id}).info(
                "access method=%s path=%s status_code=%s duration_ms=%s",
                request.method,
                request.url.path,
                status_code,
                duration_ms,
            )
            if response is not None:
                response.headers["X-Request-ID"] = request_id


def _request_id(request: Request) -> str:
    return getattr(request.state, "request_id", str(uuid.uuid4()))


def _error_response(request: Request, *, status_code: int, code: int, message: str, error_code: str) -> JSONResponse:
    payload = ApiEnvelope(
        code=code,
        message=message,
        data=ApiErrorData(errorCode=error_code),
        requestId=_request_id(request),
    )
    return JSONResponse(status_code=status_code, content=payload.model_dump())


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Prepare writable data and log directories before serving requests."""
    ensure_runtime_directories()
    configure_logging()
    if app.state.run_migrations:
        run_migrations()
    yield


def create_app() -> FastAPI:
    """Create the Phase 0 application without registering future feature routes."""
    app = FastAPI(title=settings.app_name, version=settings.app_version, lifespan=lifespan)
    app.state.run_migrations = True
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(RequestIdMiddleware)
    app.include_router(api_router)

    @app.exception_handler(AppError)
    async def handle_app_error(request: Request, exc: AppError) -> JSONResponse:
        return _error_response(
            request,
            status_code=exc.status_code,
            code=exc.code,
            message=exc.message,
            error_code=exc.error_code,
        )

    @app.exception_handler(RequestValidationError)
    async def handle_validation_error(request: Request, _: RequestValidationError) -> JSONResponse:
        return _error_response(
            request,
            status_code=422,
            code=10000,
            message="Request validation failed",
            error_code="VALIDATION_ERROR",
        )

    @app.exception_handler(Exception)
    async def handle_unexpected_error(request: Request, exc: Exception) -> JSONResponse:
        RequestLoggerAdapter(logger, {"request_id": _request_id(request)}).error(
            "unhandled exception", exc_info=exc
        )
        return _error_response(
            request,
            status_code=500,
            code=20000,
            message="Internal server error",
            error_code="INTERNAL_ERROR",
        )

    return app


app = create_app()
