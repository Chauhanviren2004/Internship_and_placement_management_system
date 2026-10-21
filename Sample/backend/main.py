from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import auth, resumes, users
from api.routes.applications import router as applications_router
from api.routes.communications import router as communications_router
from api.routes.jobs import router as jobs_router
from api.routes.legacy_auth import router as legacy_auth_router
from api.routes.legacy_routes import router as legacy_routes_router
from api.routes.notifications import router as notifications_router
from core.config import settings
from db.database import close_mongo_connection, connect_to_mongo



from fastapi import FastAPI
from api.ai_routes import router as ai_router


app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    # allow_origins=[origin.strip() for origin in settings.FRONTEND_ORIGINS.split(",") if origin.strip()],
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()


@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()


app.include_router(auth.router, prefix="/api/auth", tags=["auth"], include_in_schema=False)
app.include_router(legacy_auth_router)
app.include_router(legacy_routes_router)
app.include_router(users.router, prefix="/api/users", tags=["users"], include_in_schema=False)
app.include_router(jobs_router, prefix="/api/jobs", tags=["jobs"], include_in_schema=False)
app.include_router(applications_router, prefix="/api/applications", tags=["applications"], include_in_schema=False)
app.include_router(communications_router, prefix="/api/communications", tags=["communications"], include_in_schema=False)
app.include_router(resumes.router, prefix="/api/resumes", tags=["resumes"], include_in_schema=False)
app.include_router(ai_router, prefix="/api")
app.include_router(notifications_router, prefix="/api/ws/notifications", tags=["notifications"])



@app.get("/")
async def root():
    return {"message": "Welcome to HireHub API", "docs": "/docs"}


