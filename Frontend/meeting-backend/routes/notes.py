import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Note
from schemas import NoteResponse, NoteListResponse

router = APIRouter()


@router.get("/notes", response_model=List[NoteListResponse])
async def get_all_notes(db: Session = Depends(get_db)):
    """
    Get all notes (list view with summaries, without full transcripts)
    """
    notes = db.query(Note).order_by(Note.created_at.desc()).all()
    return notes


@router.get("/notes/{note_id}", response_model=NoteResponse)
async def get_note(note_id: int, db: Session = Depends(get_db)):
    """
    Get single note with full details including transcript
    """
    note = db.query(Note).filter(Note.id == note_id).first()
    
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    return note


@router.delete("/notes/{note_id}")
async def delete_note(note_id: int, db: Session = Depends(get_db)):
    """
    Delete note and all associated tasks (CASCADE)
    """
    note = db.query(Note).filter(Note.id == note_id).first()
    
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    db.delete(note)
    db.commit()
    
    return {"success": True, "message": f"Note {note_id} deleted"}


@router.get("/search")
async def search_notes(q: str, db: Session = Depends(get_db)):
    """
    Simple search across transcripts and summaries using SQLite LIKE
    """
    if not q or len(q) < 2:
        raise HTTPException(status_code=400, detail="Query must be at least 2 characters")
    
    search_pattern = f"%{q}%"
    
    notes = db.query(Note).filter(
        (Note.transcript.like(search_pattern)) | 
        (Note.summary.like(search_pattern))
    ).order_by(Note.created_at.desc()).all()
    
    results = []
    for note in notes:
        results.append({
            "id": note.id,
            "filename": note.filename,
            "summary": note.summary,
            "created_at": note.created_at.isoformat()
        })
    
    return {"results": results, "count": len(results)}
