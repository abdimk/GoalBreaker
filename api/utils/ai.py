import os
import json
from dotenv import load_dotenv
from pathlib import Path
import requests 

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

USE_MOCK_AI = os.getenv("USE_MOCK_AI", "False").lower() == "true"


def mock_break_down_goal(goal_text: str) -> dict:
    """Provides a functional mock response when the AI is unavailable."""
    print(f"⚠️ MOCK MODE ACTIVE: Returning static goal breakdown for '{goal_text}'.")
    
  
    if "startup" in goal_text.lower():
        tasks = ["Validate market need", "Develop a Minimum Viable Product (MVP)", "Secure seed funding", "Execute early marketing strategy", "Scale operations and hire team"]
    elif "book" in goal_text.lower() or "read" in goal_text.lower():
        tasks = ["Choose 10 books and create a reading schedule", "Allocate 30 minutes daily for reading", "Take brief notes on each chapter", "Review and summarize the main themes", "Select the next set of books"]
    else:
        tasks = ["Define the exact scope of the task", "Gather all necessary resources", "Execute the core body of work (3 steps)", "Review and refine the final output", "Finalize and deliver the result"]
        

    complexity = min(10, 3 + (len(goal_text) % 8)) 
        
    return {
        "sub_tasks": tasks,
        "complexity_score": complexity
    }

def break_down_goal(goal_text: str) -> dict:
    if USE_MOCK_AI:
        return mock_break_down_goal(goal_text)

    
    print("CRITICAL: USE_MOCK_AI is False, but the real API key is failing.")
    
    return {
        "sub_tasks": [
            "API Access Forbidden (403)", 
            "Your key is invalid or restricted", 
            "Set USE_MOCK_AI=True in .env", 
            "Restart server to enable mock mode", 
            "Contact your API provider"
        ],
        "complexity_score": 10
    }