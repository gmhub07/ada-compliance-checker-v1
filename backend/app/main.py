import os
from fastapi import FastAPI, Depends, Request
from app.services.checker import AccessibilityCheckerService
from app.models.schemas import HtmlCheckRequest, CheckResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

app = FastAPI()

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)
load_dotenv()

# Parse CORS_ORIGINS from environment variable
# Supports comma-separated values or a single URL
cors_origins_str = os.getenv("CORS_ORIGINS", "")
if cors_origins_str:
    origins = [origin.strip() for origin in cors_origins_str.split(",")]
else:
    origins = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/v1/check")
@limiter.limit("10/minute")
async def check_html(
    request: Request,
    html_request: HtmlCheckRequest,
    svc: AccessibilityCheckerService = Depends(),
):
    violations = svc.check_html(html_request.html)
    return CheckResponse(violations=violations)
