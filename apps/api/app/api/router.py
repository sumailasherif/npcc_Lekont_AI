from fastapi import APIRouter

from app.api.routes import dashboard, documents, insights

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(documents.router)
api_router.include_router(insights.router)
api_router.include_router(dashboard.router)
