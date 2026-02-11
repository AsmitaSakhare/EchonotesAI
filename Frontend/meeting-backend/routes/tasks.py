from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Task, Note
from schemas import TaskResponse, TaskUpdate

router = APIRouter()


@router.get("/tasks", response_model=List[TaskResponse])
async def get_all_tasks(db: Session = Depends(get_db)):
    """
    Get all tasks across all notes
    """
    results = db.query(Task, Note.filename).join(Note, Task.note_id == Note.id).order_by(Task.created_at.desc()).all()
    
    tasks = []
    for task, filename in results:
        task_dict = task.__dict__
        task_dict["note_filename"] = filename
        tasks.append(task_dict)
        
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
