import logging
from contextlib import asynccontextmanager
import httpx
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from backend.core.config import settings
from backend.api.routes import router

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("safeguard_ai")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Performance Optimization (Phase 5): Initialize persistent async HTTP connection pool
    logger.info("Initializing SafeGuard AI async HTTP connection pool...")
    app.state.http_client = httpx.AsyncClient(
        timeout=httpx.Timeout(settings.REQUEST_TIMEOUT_SECONDS, connect=3.0),
        limits=httpx.Limits(max_keepalive_connections=20, max_connections=50),
        headers={"User-Agent": "SafeGuard-AI-ThreatRadar/2.1"}
    )
    yield
    logger.info("Closing SafeGuard AI async HTTP connection pool...")
    await app.state.http_client.aclose()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="SAFEGUARD AI — Intelligent Cybersecurity Threat Detection & Plain-Language Explanation Engine",
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/api/py/docs",
    redoc_url="/api/py/redoc",
    openapi_url="/api/py/openapi.json"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Request validation error on {request.url.path}: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Validation Error",
            "message": "Invalid input format or missing required fields.",
            "details": exc.errors()
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred during threat forensic analysis."
        }
    )

# Mount routes under both /api/py and directly under root for Vercel Serverless routing flexibility
app.include_router(router, prefix="/api/py")
app.include_router(router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
