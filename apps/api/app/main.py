from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import get_settings

settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    # Production: open the Postgres pool and warm the embedding client here.
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.api_version,
    description=(
        "Multilingual shop-floor capability API. Grounded answers only from "
        "supervisor-approved work instructions."
    ),
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/", tags=["meta"])
def root() -> dict[str, str]:
    return {
        "name": settings.app_name,
        "version": settings.api_version,
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health", tags=["meta"])
def health() -> dict[str, str]:
    return {"status": "ok", "version": settings.api_version, "env": settings.api_env}
