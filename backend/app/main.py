from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.config import settings
from app.db.session import Base, engine
from app.routers.diagnosis import router as diagnosis_router
from app.routers.gejala import router as gejala_router
from app.routers.history import router as history_router
from app.routers.auth import router as auth_router

app = FastAPI(
    title="Sistem Diagnosis Awal Risiko Kanker Payudara",
    version="0.1.0",
)

allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    # Buat tabel bila belum ada
    import app.models.case  # noqa: F401
    import app.models.diagnosis  # noqa: F401
    import app.models.user  # noqa: F401
    Base.metadata.create_all(bind=engine)


@app.get("/ping")
def ping():
    return {"status": "ok"}


app.include_router(diagnosis_router)
app.include_router(gejala_router)
app.include_router(history_router)
app.include_router(auth_router)
