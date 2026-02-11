# schemas/__init__.py
from .note import NoteCreate, NoteResponse, NoteListResponse
from .task import TaskCreate, TaskResponse, TaskUpdate

__all__ = [
    "NoteCreate",
    "NoteResponse",
    "NoteListResponse",
    "TaskCreate",
    "TaskResponse",
    "TaskUpdate",
]
