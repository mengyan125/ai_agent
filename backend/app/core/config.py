from pathlib import Path
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration loaded from environment variables and .env."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Agent Studio API"
    app_version: str = "0.1.0"
    environment: Literal["development", "production"] = "development"
    data_dir: Path = Path("data")
    database_url: str | None = None
    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:5173"])

    @property
    def resolved_database_url(self) -> str:
        if self.database_url:
            return self.database_url
        return f"sqlite:///{(self.data_dir / 'app.db').resolve().as_posix()}"

    @property
    def logs_dir(self) -> Path:
        return self.data_dir / "logs"


settings = Settings()
