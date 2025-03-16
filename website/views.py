from flask import Blueprint, render_template, jsonify, request, session, url_for, redirect
from _stockfish import get_best_move
from chat_messages import
from flask_cors import CORS

views = Blueprint('views', __name__)
CORS(views)
@views.route("/")
def play():
    return render_template("play.html")

@views.route("/test")
def test():
    return render_template("test.html")

@views.route("/api/stockfish/", methods=['POST'])
def get_move():
    data = request.json
    return jsonify(data = get_best_move(data['current_fen']))

@views.route("/api/chatgpt/", methods=['POST'])
def get_move():
    data = request.json
    return jsonify(data = get_best_move(data['current_fen']))
    