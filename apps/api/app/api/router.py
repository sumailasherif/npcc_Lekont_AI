from fastapi import APIRouter

from app.api.routes import analytics, experts, gaps, query, skills, sops, sources, translation

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(sources.router)
api_router.include_router(query.router)
api_router.include_router(sops.router)
api_router.include_router(gaps.router)
api_router.include_router(skills.router)
api_router.include_router(analytics.router)
api_router.include_router(translation.router)
api_router.include_router(experts.router)
