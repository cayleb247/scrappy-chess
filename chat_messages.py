from openai import OpenAI
from dotenv import load_dotenv
import json
import os

api_key = os.getenv("API_KEY")
client = OpenAI(api_key=api_key)

response = client.chat.completions.create(
  model="gpt-3.5-turbo-0125",  # or another suitable model that supports JSON mode
  response_format={"type": "json_object"},
  messages=[
    {"role": "system", "content": "You are another person playing a game of chess with me. Respond emotionally to the message I give you. Always respond with a JSON object with two properties: 'message' (a short description of how you feel about the user's comment) and 'score' (current mood rating with 0 being very sad, 50 being neutral, and 100 being very happy)."},
    {"role": "user", "content": "Nice move! That was very well played."}
  ]
)

response = json.loads(response.choices[0].message.content)

print(response["message"])
print(response["score"])