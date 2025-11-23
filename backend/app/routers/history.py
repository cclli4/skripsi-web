from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.history import HistoryList, HistoryItem
from app.models.diagnosis import Diagnosis


router = APIRouter(prefix="/history", tags=["history"])


@router.get("", response_model=HistoryList)
def get_history(db: Session = Depends(get_db)):
    rows = db.query(Diagnosis).order_by(Diagnosis.created_at.desc()).limit(50).all()
    items = [
        HistoryItem(
            id=r.id,
            created_at=r.created_at,
            risk_value=r.risk_value,
            risk_category=r.risk_category,
        )
        for r in rows
    ]
    return HistoryList(items=items)