from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class TaskCreate(BaseModel):
    """Schema for creating a new task"""
    note_id: int
    task: str
    deadline: Optional[str] = None  # ISO date: YYYY-MM-DD
    status: str = "pending"


class TaskResponse(BaseModel):
    """Schema for task response"""
    id: int
    note_id: int
    note_filename: Optional[str] = None
    task: str
    deadline: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class TaskUpdate(BaseModel):
    """Schema for updating task status"""
    status: str  # pending or completed
