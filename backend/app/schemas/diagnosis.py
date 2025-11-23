from typing import Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel


class DiagnosisRequest(BaseModel):
    features: Dict[str, float]


class SimilarCase(BaseModel):
    id: int
    risk_value: float
    risk_category: str


class DiagnosisResult(BaseModel):
    risk_value: float
    risk_category: str
    recommendation: Optional[str] = None
    similar_cases: List[SimilarCase] = []


class DiagnosisHistoryItem(BaseModel):
    id: int
    created_at: datetime
    risk_value: float
    risk_category: str