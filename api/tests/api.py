import google.generativeai as genai
import os


genai.configure(api_key="")

model = genai.GenerativeModel("gemini-2.0-flash")  

response = model.generate_content(
    "Testing Gemini. Say hello world."
)

print(response.text)
