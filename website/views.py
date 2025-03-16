from flask import Blueprint, render_template, jsonify, request, session, url_for, redirect
from _stockfish import get_best_move
from chat_messages import getChatResponse
from flask_cors import CORS

views = Blueprint('views', __name__)
CORS(views)
@views.route("/")
def play():
    return render_template("play.html")

@views.route("/api/stockfish/", methods=['POST'])
def get_move():
    data = request.json
    print(data["current_elo"])
    return jsonify(data = get_best_move(data['current_fen'], data['current_elo']))

@views.route("/api/chatgpt/", methods=['POST'])
def get_response():
    data = request.json
    print(data["emotion_history"])
    score, output_message, emotion_history = getChatResponse(data["message"], data["emotion_history"])
    print(score, output_message, emotion_history)
    return jsonify({"score": score, "output_message": output_message, "emotion_history": emotion_history})
    