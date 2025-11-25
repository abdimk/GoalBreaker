import os
from google import genai
from dotenv import load_dotenv
from pathlib import Path


env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ Error: GEMINI_API_KEY not found in .env")
    exit()

print(f"🔑 Key found: {api_key[:5]}... (checking access)")

try:
    client = genai.Client(api_key=api_key)
    print("\n🌍 Fetching available models for your API Key...")
    
    found_any = False
    
    for m in client.models.list():
       
        if "generateContent" in m.supported_generation_methods:
            print(f"  ✅ AVAILABLE: {m.name}")
            found_any = True
            
    if not found_any:
        print("\n⚠️ No models found with 'generateContent' capability.")
        print("This usually means your API Key is valid but has no service enabled.")
    else:
        print("\nUse one of the names above in your utils/ai.py file.")

except Exception as e:
    print(f"\n❌ Connection Error: {e}")