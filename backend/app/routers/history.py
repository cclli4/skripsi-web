from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.history import HistoryList, HistoryItem, HistoryClearResponse
from app.models.diagnosis import Diagnosis
from app.services.auth import get_current_user


router = APIRouter(prefix="/history", tags=["history"])


@router.get("", response_model=HistoryList)
def get_history(db: Session = Depends(get_db), _user=Depends(get_current_user)):
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


@router.delete("", response_model=HistoryClearResponse)
def clear_history(db: Session = Depends(get_db), _user=Depends(get_current_user)):
    deleted = db.query(Diagnosis).delete()
    db.commit()
    return HistoryClearResponse(deleted=deleted)
