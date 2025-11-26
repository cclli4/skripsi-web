from typing import Any, Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class DiagnosisRequest(BaseModel):
    # Terima nilai string dari frontend; mesin fuzzy akan menormalkan.
    features: Dict[str, Any]


class SimilarCase(BaseModel):
    id: int
    risk_value: float
    risk_category: str


class DiagnosisResult(BaseModel):
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    risk_value: float
    risk_category: str
    recommendation: Optional[str] = None
    similar_cases: List[SimilarCase] = Field(default_factory=list)

    class Config:
        orm_mode = True


class DiagnosisHistoryItem(BaseModel):
    id: int
    created_at: datetime
    risk_value: float
    risk_category: str
