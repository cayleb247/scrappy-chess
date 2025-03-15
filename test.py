from stockfish import Stockfish

stockfish = Stockfish(path="/Users/calebwang/Downloads/stockfish/stockfish-macos-m1-apple-silicon")

stockfish.set_position(["e2e4", "e7e6"])

stockfish.make_moves_from_current_position(["g4d7", "a8b8", "f1d1"])

print(stockfish.get_best_move())