var board = Chessboard('board', {
    draggable: true,
    pieceTheme: "{{ url_for('static', filename='chessboardjs-1.0.0/img/chesspieces/wikipedia/{piece}.png')}}"
  })