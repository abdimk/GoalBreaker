from pydantic import BaseModel
from typing import List, Optional

class GoalInput(BaseModel):
    goal: str

class GoalOutput(BaseModel):
    id: int
    goal_text: str
    sub_tasks: List[str]
    complexity_score: int

    class Config:
        from_attributes = True