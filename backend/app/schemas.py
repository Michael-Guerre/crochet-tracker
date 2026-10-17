from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    email: str
    password: str


class UserRead(BaseModel):
    id: int
    email: str


class Token(BaseModel):
    access_token: str
    token_type: str


class PatternCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    pattern_data: Dict[str, Any] = Field(default_factory=dict)


class PatternRead(BaseModel):
    id: int
    user_id: int
    name: str
    description: Optional[str] = ""
    pattern_data: Dict[str, Any] = Field(default_factory=dict)


class ProgressCreate(BaseModel):
    pattern_id: int
    current_row: int = 0
    completed_rows: int = 0
    notes: str = ""


class ProgressRead(BaseModel):
    id: int
    user_id: int
    pattern_id: int
    current_row: int
    completed_rows: int
    notes: str

