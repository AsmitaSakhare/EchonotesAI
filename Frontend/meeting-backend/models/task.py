from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base


class Task(Base):
    """
    Task model - stores action items extracted from meeting notes
    """
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    note_id = Column(Integer, ForeignKey("notes.id", ondelete="CASCADE"), nullable=False)
    task = Column(Text, nullable=False)  # Task description
    deadline = Column(String(10), nullable=True)  # ISO date format: YYYY-MM-DD
    status = Column(String(20), default="pending")  # pending or completed
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Task(id={self.id}, task='{self.task[:30]}...', deadline={self.deadline}, status={self.status})>"
