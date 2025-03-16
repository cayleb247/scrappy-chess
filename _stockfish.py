from stockfish import Stockfish
import chess

stockfish = Stockfish(path="/Users/calebwang/Downloads/stockfish/stockfish-macos-m1-apple-silicon",
                      parameters={
                          "Threads": 1,
                          "Skill Level": 20,
                          "Minimum Thinking Time": 20,
                          "UCI_Elo": 1350
                      })

def get_best_move(fen_string):
    '''
    Returns the FEN string of the best move from stockfish
    '''

    stockfish.set_fen_position(fen_string)

    best_move = stockfish.get_best_move()

    board = chess.Board(fen_string)

    move = chess.Move.from_uci(best_move)

    board.push(move)

    return board.fen()

