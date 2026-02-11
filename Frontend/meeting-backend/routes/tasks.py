from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Task
from schemas import TaskResponse, TaskUpdate

router = APIRouter()


@router.get("/tasks", response_model=List[TaskResponse])
async def get_all_tasks(db: Session = Depends(get_db)):
    """
    Get all tasks across all notes
    """
    tasks = db.query(Task).order_by(Task.created_at.desc()).all()
    return tasks


@router.get("/tasks/note/{note_id}", response_model=List[TaskResponse])
async def get_tasks_by_note(note_id: int, db: Session = Depends(get_db)):
    """
    Get all tasks for a specific note
    """
    tasks = db.query(Task).filter(Task.note_id == note_id).all()
    return tasks


@router.patch("/tasks/{task_id}")
async def update_task_status(
    task_id: int,
    task_update: TaskUpdate,
    db: Session = Depends(get_db)
):
    """
    Update task status (pending/completed)
    """
    task = db.query(Task).filter(Task.id == task_id).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.status = task_update.status
    db.commit()
    db.refresh(task)
    
    return {
        "success": True,
        "task_id": task.id,
        "status": task.status
    }
