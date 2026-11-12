from fastapi import APIRouter

from app.api.routes import approvals, dashboard, documents, insights, whatsapp

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(documents.router)
api_router.include_router(insights.router)
api_router.include_router(dashboard.router)
api_router.include_router(whatsapp.router)
api_router.include_router(approvals.router)
