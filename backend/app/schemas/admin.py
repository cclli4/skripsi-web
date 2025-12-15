from datetime import datetime
from pydantic import BaseModel
from typing import Any, Dict


class OverviewStats(BaseModel):
    total_users: int
    patients: int
    experts: int
    admins: int
    total_diagnosis: int
    total_cases: int


class CaseItem(BaseModel):
    id: int
    risk_value: float
    risk_category: str
    created_at: datetime
    recommendation: str | None = None


class CaseList(BaseModel):
    items: list[CaseItem]


class DiagnosisItem(BaseModel):
    id: int
    risk_value: float
    risk_category: str
    created_at: datetime
    features: Dict[str, Any]


class DiagnosisList(BaseModel):
    items: list[DiagnosisItem]
