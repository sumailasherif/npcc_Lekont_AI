from fastapi import APIRouter

from app.api.routes import analytics, gaps, query, skills, sops, sources

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(sources.router)
api_router.include_router(query.router)
api_router.include_router(sops.router)
api_router.include_router(gaps.router)
api_router.include_router(skills.router)
api_router.include_router(analytics.router)
