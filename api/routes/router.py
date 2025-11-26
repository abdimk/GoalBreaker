from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from schema.schema import GoalInput, GoalOutput
from models.models import Goal
from models.database import get_db
from utils.ai import break_down_goal

router = APIRouter()

@router.post("/break-goal", response_model=GoalOutput)
async def generate_goal_breakdown(
    payload: GoalInput, 
    db: AsyncSession = Depends(get_db)
):
    ai_data = break_down_goal(payload.goal)
    
 
    if ai_data.get("sub_tasks") and ai_data["sub_tasks"][0] in [
        "Error occurred during API call", 
        "API request timed out", 
        "Invalid response format from API"
    ]:
 
        raise HTTPException(
            status_code=503,
            detail="Goal breakdown service is currently unavailable. Check GROK_API_KEY or service status."
        )
    new_goal = Goal(
        goal_text=payload.goal,
        sub_tasks=ai_data["sub_tasks"],
        complexity_score=ai_data["complexity_score"]
    )
    
    db.add(new_goal)
    await db.commit()
    await db.refresh(new_goal)
    
    return new_goal