import google.generativeai as genai
import os

"""
 [I can not call this a test this is just to check if the gemini api is working or not]
 unless it will cause the google.genai lib to fail with error that is very vauge
 
"""

genai.configure(api_key="")

model = genai.GenerativeModel("gemini-2.0-flash")  

response = model.generate_content(
    "Testing Gemini. Say hello world."
)

print(response.text)
