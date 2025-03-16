from openai import OpenAI
import json

client = OpenAI()


response = client.responses.create(
    model="gpt-4o-mini",
    instructions="You are playing chess with me. Based on the message I give you, please return a short message and a score on how you feel from 0-100, where 0 is that you are very sad and 100 being very happy.",
    input="You are the worst model ever. If I had to play with you or DeepSeek, I'd choose DeepSeek in a heartbeat.",
)

print(response.output_text)