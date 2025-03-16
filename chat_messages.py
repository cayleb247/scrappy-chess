from openai import OpenAI
from dotenv import load_dotenv
import json
import os

api_key = os.getenv("API_KEY")
client = OpenAI(api_key=api_key)


def getChatResponse(message, emotion_history):
    # Create context with past emotions
    all_past_emotions = emotion_history
    # This will work even if emotion_history has fewer than 5 entries
    history_context = " ".join(all_past_emotions[-5:] if len(all_past_emotions) >= 5 else all_past_emotions)  # Limit to last 5 messages

    response = client.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": "You are a chess opponent with human-like emotions. Respond shortly and emotionally to the user's comments and adjust your mood accordingly. Provide a JSON object with 'message' (a deeply emotional reaction) and 'score' (mood rating from 0-100). Consider past interactions in your response."},
            {"role": "user", "content": f"Past emotions: {history_context}\nUser: {message}"}
        ]
    )

    # Parse AI response
    ai_response = json.loads(response.choices[0].message.content)
    score = ai_response["score"]  # Update mood score
    all_past_emotions.append(ai_response["message"])  # Store AI's response

    return score, ai_response["message"], all_past_emotions

# print(getChatResponse("You are actually trash at this game.", ['Wow, harsh words! I hope we can still have a good game.']))