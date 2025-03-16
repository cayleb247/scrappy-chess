// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js

// Modern approach using fetch

var board = null;
var game = new Chess();
let turns = 0; // keep track of number of turns
let main_emotion_history = [];
let messageRight = true;
let current_elo = 2500;

// Display default elo
displayElo(current_elo);

const gameOverDialog = document.querySelector("dialog"); // use to create game over screen

const playAgainButton = document.querySelector("dialog button");
playAgainButton.addEventListener("click", () => {
  gameOverDialog.close();
  game.reset();
  board.start();
  turns = 0;
  main_emotion_history = []
})

let inputForm = document.getElementById('user-input');
let input = document.getElementById('the-input')
inputForm.addEventListener('submit', (event) => {
  // Prevent the default form submission
  event.preventDefault();
  let value = input.value;
  input.value = "";
  if (value != "" && messageRight) {
    console.log(main_emotion_history);
    getAIResponse(value, main_emotion_history).then(response => {
      // Now you have the actual response data
      let [ai_score, ai_message, all_past_emotions] = response;
      main_emotion_history = all_past_emotions;
      messageRight = false;

      // Calculate elo
      current_elo = calculateElo(current_elo, ai_score);

      // Display current elo
      displayElo(current_elo);

      // Display messages
      displayMessage(value, false);
      setTimeout(() => {
        displayMessage(ai_message, true);
      }, 1500)
      
  })
  }
}
)

function displayMessage(message, ai) {
  const messageContainer = document.querySelector(".message-container");
  const messageBubble = document.createElement("div");
  const messageText = document.createElement("p");
  messageText.textContent = message;
  messageBubble.appendChild(messageText);
  if (ai) {
    messageBubble.setAttribute("class", "ai-message");
  }
  else {
    messageBubble.setAttribute("class", "human-message");
  }
  messageContainer.appendChild(messageBubble);
}

function calculateElo(input_elo, mood_rating) {
  console.log(input_elo);
  let calc_elo;
  if (mood_rating > 50) {
    calc_elo = input_elo + 3 * (mood_rating - 50);
  }
  else if (mood_rating < 50) {
    calc_elo = input_elo - 3 * (50 - mood_rating);
  }
  else {
    calc_elo = input_elo;
  }
  return calc_elo;
}

function displayElo(input_elo) {
  const eloText = document.querySelector(".elo");
  eloText.textContent = input_elo;
}

// Chess functionality

async function getAIResponse (message_, emotion_history_) {

  let response = await fetch('http://127.0.0.1:5000/api/chatgpt/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: message_,
      emotion_history: emotion_history_
    })
  })

  let json = await response.json();
  let score = json.score;
  let output_message = json.output_message;
  let emotion_history = json.emotion_history;

  return [score, output_message, emotion_history];
}

function checkChessResult () {
  if (game.in_checkmate()) {
    if (game.turn() == 'w') {
      return "Black wins by checkmate!";
    }
    else {
      return "White wins by checkmate!";
    }
    
  }
  else if  (game.in_draw()) {
    return "Game ends in stalemate!";
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
      current_fen: game.fen(),
      current_elo: current_elo
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

function onDrop(source, target) {
    // see if the move is legal
    var move = game.move({
      from: source,
      to: target,
      promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })
  
    // illegal move
    if (move === null) return 'snapback';

    console.log(messageRight);
    messageRight = true;
  
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