// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js

// Modern approach using fetch

const gameOverDialog = document.querySelector("dialog") // use to create game over screen

var board = null
var game = new Chess()

const playAgainButton = document.querySelector("dialog button");
playAgainButton.addEventListener("click", () => {
  gameOverDialog.close()
  game.reset()
  board.start()
})

function checkChessResult () {
  if (game.in_checkmate()) {
    if (game.turn() == 'w') {
      return "Black wins by checkmate!"
    }
    else {
      return "White wins by checkmate!"
    }
    
  }
  else if  (game.in_draw()) {
    return "Game ends in stalemate!"
  }
}

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) {
    const gameOverWinner = document.querySelector(".gameover-container p");
    gameOverWinner.textContent = checkChessResult()
    gameOverDialog.showModal();
    return false
  }
  // only pick up pieces for White
  if (piece.search(/^b/) !== -1) return false
}

async function makeStockfishMove () {

  let response = await fetch('http://127.0.0.1:5000/api/stockfish/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      current_fen: game.fen()
    })
  })

  let json = await response.json()
  let data = json.data;

  var possibleMoves = game.moves()

  // game over
  if (possibleMoves.length === 0) return

  game.move(data)

  board.position(game.fen())
}

function onDrop (source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'

  // make random legal move for black
  window.setTimeout(makeStockfishMove, 250)



}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen())

}

var config = {
  pieceTheme: 'static/chessboardjs-1.0.0/img/chesspieces/wikipedia/{piece}.png',
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}
board = Chessboard('board', config)

updateStatus()