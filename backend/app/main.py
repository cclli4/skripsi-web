from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.config import settings
from app.db.session import Base, engine
from app.routers.diagnosis import router as diagnosis_router
from app.routers.history import router as history_router

app = FastAPI(
    title="Sistem Diagnosis Awal Risiko Kanker Payudara",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    # Buat tabel bila belum ada
    import app.models.case  # noqa: F401
    import app.models.diagnosis  # noqa: F401
    Base.metadata.create_all(bind=engine)


@app.get("/ping")
def ping():
    return {"status": "ok"}


app.include_router(diagnosis_router)
app.include_router(history_router)