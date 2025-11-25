from sqlalchemy import Column, Integer, String, JSON
from models.database import Base

class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    goal_text = Column(String, index=True)
    sub_tasks = Column(JSON) 
    complexity_score = Column(Integer)