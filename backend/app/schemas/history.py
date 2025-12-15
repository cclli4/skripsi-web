from typing import Any, Dict, List
from pydantic import BaseModel
from datetime import datetime


class HistoryItem(BaseModel):
    id: int
    created_at: datetime
    risk_value: float
    risk_category: str
    features: Dict[str, Any]


class HistoryList(BaseModel):
    items: List[HistoryItem]


class HistoryClearResponse(BaseModel):
    deleted: int
