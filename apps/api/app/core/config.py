from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration, read from environment or .env."""

    model_config = SettingsConfigDict(
        env_file=(".env", "../../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Retenou AI API"
    api_version: str = "0.1.0"
    api_env: str = "development"
    cors_origins: str = "http://localhost:3000"

    # OpenCode Go is the only model provider this project uses.
    opencode_go_api_key: str = ""
    opencode_go_base_url: str = "https://opencode.ai/inference/go/openai/v1"
    llm_model: str = "deepseek-v4.1-flash"

    # Supabase free tier (Postgres + pgvector).
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""
    database_url: str = ""

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
