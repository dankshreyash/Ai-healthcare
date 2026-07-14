"""
FastAPI application entry point.
Configures CORS, creates DB tables on startup, and mounts API routers.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database.database import engine, Base

# Import all models so Base.metadata is aware of them
from app.models import Interaction  # noqa: F401

# Import routers
from app.api.routes.interaction import router as interaction_router
from app.api.routes.chat import router as chat_router

app = FastAPI(
    title=settings.APP_TITLE,
    version=settings.APP_VERSION,
    description="AI-First CRM for Healthcare Professionals – Pharma Sales Module",
)

# --- CORS (allow React dev server) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Startup event: create tables ---
@app.on_event("startup")
def on_startup():
    """Create all database tables if they don't exist."""
    Base.metadata.create_all(bind=engine)


# --- Mount routers ---
app.include_router(interaction_router)
app.include_router(chat_router)


# --- Health check ---
@app.get("/health", tags=["Health"])
def health_check():
    """Simple health check endpoint."""
    return {"status": "healthy", "app": settings.APP_TITLE, "version": settings.APP_VERSION}
