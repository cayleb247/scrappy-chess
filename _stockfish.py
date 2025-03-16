from stockfish import Stockfish
import chess


def get_best_move(fen_string, current_elo):
    '''
    Returns the FEN string of the best move from stockfish
    '''
    stockfish = Stockfish(path="/Users/calebwang/Downloads/stockfish/stockfish-macos-m1-apple-silicon", depth=5,
                      parameters={
                          "Threads": 1,
                          "Hash": 8,
                          "Minimum Thinking Time": 1000,
                          "UCI_Elo": current_elo
                      })

    stockfish.set_fen_position(fen_string)

    best_move = stockfish.get_best_move()

    board = chess.Board(fen_string)

    uci_move = board.parse_uci(best_move)

    san_move = board.san(uci_move)

    return san_move

# print(get_best_move("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"))
