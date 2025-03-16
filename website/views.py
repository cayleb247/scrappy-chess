from flask import Blueprint, render_template, request, session, url_for, redirect
from _stockfish import get_best_move

views = Blueprint('views', __name__)

@views.route("/")
def play():
    return render_template("play.html")

@views.route("/api/stockfish", methods=['POST'])
def get_move():
    data = request.json
    return get_best_move(data)
    