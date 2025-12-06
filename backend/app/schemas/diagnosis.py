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
    rule_origin: Optional[str] = None
    similarity: Optional[float] = None


class DiagnosisResult(BaseModel):
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    risk_value: float
    risk_category: str
    fuzzy_risk_value: Optional[float] = None
    fuzzy_risk_category: Optional[str] = None
    cbr_risk_value: Optional[float] = None
    cbr_risk_category: Optional[str] = None
    hybrid_fuzzy_weight: Optional[float] = None
    hybrid_cbr_weight: Optional[float] = None
    hybrid_computation: Optional[str] = None
    recommendation: Optional[str] = None
    similar_cases: List[SimilarCase] = Field(default_factory=list)

    class Config:
        orm_mode = True


class DiagnosisHistoryItem(BaseModel):
    id: int
    created_at: datetime
    risk_value: float
    risk_category: str
