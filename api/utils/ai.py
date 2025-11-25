import os
import json
from dotenv import load_dotenv
from pathlib import Path
import requests 

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

USE_MOCK_AI = os.getenv("USE_MOCK_AI", "False").lower() == "true"
GROK_API_KEY = os.getenv("GROK_API_KEY")  

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

    if not GROK_API_KEY:
        raise ValueError("GROK_API_KEY not found in environment variables. Set it in .env.")

   
    prompt = f"""
    Break down the following goal into 5 key sub-tasks. Also provide a complexity score from 1 to 10.
    Goal: {goal_text}
    
    Respond only with strict JSON in this format, no extra text:
    {{
        "sub_tasks": ["task1", "task2", "task3", "task4", "task5"],
        "complexity_score": number
    }}
    """

 
    payload = {
        "messages": [
            {"role": "system", "content": "You are Grok, a helpful AI from xAI."},
            {"role": "user", "content": prompt}
        ],
        "model": "grok-4",
        "stream": False
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {GROK_API_KEY}"
    }

    try:
        response = requests.post(
            "https://api.x.ai/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=3600
        )
        response.raise_for_status()
        api_result = response.json()
        
       
        content = api_result["choices"][0]["message"]["content"]
        
        
        result = json.loads(content)
        return result

    except requests.exceptions.RequestException as e:
        print(f"API request failed: {e}")
        return {
            "sub_tasks": ["Error occurred during API call"],
            "complexity_score": 10
        }
    except (KeyError, json.JSONDecodeError) as e:
        print(f"Failed to parse API response: {e}")
        return {
            "sub_tasks": ["Invalid response format from API"],
            "complexity_score": 10
        }


