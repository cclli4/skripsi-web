from typing import List, Optional

from pydantic import BaseModel


class GejalaOption(BaseModel):
    label: str
    score: float
    aliases: List[str] = []


class GejalaField(BaseModel):
    key: str
    label: str
    helper: Optional[str] = None
    options: List[GejalaOption]


class GejalaList(BaseModel):
    items: List[GejalaField]

