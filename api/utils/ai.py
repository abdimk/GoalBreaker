import os
import json
from dotenv import load_dotenv
from pathlib import Path
import re
import google.generativeai as genai

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

USE_MOCK_AI = os.getenv("USE_MOCK_AI", "False").lower() == "true"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

API_TIMEOUT_SECONDS = 30

def mock_break_down_goal(goal_text: str) -> dict:
    print(f"MOCK MODE ACTIVE: Returning static goal breakdown for '{goal_text}'.")
    if "startup" in goal_text.lower():
        tasks = ["Validate market need", "Develop MVP", "Secure funding", "Launch early marketing", "Scale operations"]
    elif "book" in goal_text.lower() or "read" in goal_text.lower():
        tasks = ["Pick 10 books", "Create reading schedule", "Read 30 minutes daily", "Write chapter notes", "Summarize main ideas"]
    else:
        tasks = ["Clarify scope", "Gather resources", "Do main 3-step work", "Review output", "Finalize delivery"]
    complexity = min(10, 3 + (len(goal_text) % 8))
    return {"sub_tasks": tasks, "complexity_score": complexity}

def break_down_goal(goal_text: str) -> dict:
    if USE_MOCK_AI:
        return mock_break_down_goal(goal_text)
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not found in .env")
    prompt = f"""
You must respond with valid JSON only.

Structure:
{{
  "sub_tasks": [
    "task 1",
    "task 2",
    "task 3",
    "task 4",
    "task 5"
  ],
  "complexity_score": number
}}

Rules:
- Exactly 5 subtasks.
- No explanations.
- No markdown.
- No text outside the JSON.
- sub_tasks must be a list of 5 strings.
- complexity_score must be an integer from 1 to 10.

Goal: "{goal_text}"
"""
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(
            prompt,
            generation_config={"temperature": 0, "max_output_tokens": 150}
        )
        raw = response.text.strip()
        raw_clean = re.sub(r"^```json\s*|\s*```$", "", raw, flags=re.DOTALL)
        raw_clean = re.sub(r"^```|\s*```$", "", raw_clean, flags=re.DOTALL)
        result = json.loads(raw_clean)
        return result
    except json.JSONDecodeError:
        print("JSON parsing failed.")
        print("Received:", raw)
        return {"sub_tasks": ["Invalid response format"], "complexity_score": 10}
    except Exception as e:
        print(f"Gemini API error: {e}")
        return {"sub_tasks": ["AI request failed"], "complexity_score": 10}
