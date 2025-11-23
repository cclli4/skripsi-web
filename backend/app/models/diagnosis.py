from datetime import datetime
from sqlalchemy import Column, Integer, Float, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.db.session import Base


class Diagnosis(Base):
    __tablename__ = "diagnosis"

    id = Column(Integer, primary_key=True, index=True)
    input_features_json = Column(Text, nullable=False)
    risk_value = Column(Float, nullable=False)
    risk_category = Column(String(16), nullable=False)
    recommendation = Column(Text, nullable=True)
    similar_case_id = Column(Integer, ForeignKey("case.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    similar_case = relationship("Case", back_populates="diagnoses")