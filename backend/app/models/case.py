from datetime import datetime
from sqlalchemy import Column, Integer, Float, String, Text, DateTime
from sqlalchemy.orm import relationship

from app.db.session import Base


class Case(Base):
    __tablename__ = "case"

    id = Column(Integer, primary_key=True, index=True)
    features_json = Column(Text, nullable=False)
    risk_value = Column(Float, nullable=False)
    risk_category = Column(String(16), nullable=False)
    recommendation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    diagnoses = relationship("Diagnosis", back_populates="similar_case")