from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime

from app.db.session import Base


class User(Base):
    """Penyimpanan akun pengguna sederhana."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(128), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(32), nullable=False, default="patient")  # patient | expert | admin
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
