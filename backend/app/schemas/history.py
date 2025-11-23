from typing import List
from pydantic import BaseModel
from datetime import datetime


class HistoryItem(BaseModel):
    id: int
    created_at: datetime
    risk_value: float
    risk_category: str


class HistoryList(BaseModel):
    items: List[HistoryItem]