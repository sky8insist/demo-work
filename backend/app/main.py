import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import closure_router, emotion_router, transcription_router


def _frontend_origins() -> list[str]:
    configured = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173,http://127.0.0.1:5173")
    return [origin.strip() for origin in configured.split(",") if origin.strip()]


app = FastAPI(title="Last30 API", version="2.0.0")
app.add_middleware(CORSMiddleware, allow_origins=_frontend_origins(), allow_methods=["*"], allow_headers=["*"])
app.include_router(closure_router)
app.include_router(emotion_router)
app.include_router(transcription_router)

@app.get("/health")
def health():
    demo_mode = os.getenv("DEMO_MODE", "true").lower() in {"1", "true", "yes", "on"}
    return {"status": "ok", "mode": "demo" if demo_mode else "live"}
