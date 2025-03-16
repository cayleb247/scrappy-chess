/**
 * Converts Long Algebraic Notation (LAN) to Standard Algebraic Notation (SAN)
 * LAN example: "e2e4" (from e2 to e4)
 * SAN example: "e4" (pawn moves to e4)
 * 
 * @param {string} lanMove - A chess move in LAN notation
 * @return {string} The same move in SAN notation
 */
export function longToShortNotation(lanMove) {
    // Handle castling
    if (lanMove === "e1g1") return "O-O";     // White kingside castling
    if (lanMove === "e1c1") return "O-O-O";   // White queenside castling
    if (lanMove === "e8g8") return "O-O";     // Black kingside castling
    if (lanMove === "e8c8") return "O-O-O";   // Black queenside castling
    
    // Parse the LAN move
    const from = lanMove.substring(0, 2);
    const to = lanMove.substring(2, 4);
    const promotion = lanMove.length > 4 ? lanMove[4] : "";
    
    // Get piece type from the starting square (assuming a simplified board representation)
    // In a real implementation, you would need the actual board position
    const pieceType = getPieceType(from);
    
    // For pawns, we typically don't include the piece symbol in SAN
    const pieceSymbol = pieceType === "P" ? "" : pieceType;
    
    // Check if it's a capture (in a real implementation, this would check if a piece exists at the destination)
    // Here we'll just simulate it based on different files
    const isCapture = from[0] !== to[0] && pieceType === "P";
    const captureSymbol = isCapture ? "x" : "";
    
    // For pawns that capture, we include the file of origin
    const fromFile = isCapture ? from[0] : "";
    
    // Handle promotion
    const promotionSuffix = promotion ? "=" + promotion.toUpperCase() : "";
    
    // Combine all parts to form SAN
    return pieceSymbol + fromFile + captureSymbol + to + promotionSuffix;
  }
  
  /**
   * Mock function to determine piece type from a square
   * In a real implementation, this would look up the actual piece on the board
   * 
   * @param {string} square - The square in algebraic notation (e.g., "e2")
   * @return {string} The piece type (P, N, B, R, Q, K)
   */
  function getPieceType(square) {
    // This is a very simplified version. In reality, you'd need the actual board state.
    const rank = square[1];
    
    // Assume pawns for ranks 2 and 7
    if (rank === "2" || rank === "7") return "P";
    
    // Assume pieces for ranks 1 and 8
    if (rank === "1" || rank === "8") {
      const file = square[0];
      if (file === "a" || file === "h") return "R";
      if (file === "b" || file === "g") return "N";
      if (file === "c" || file === "f") return "B";
      if (file === "d") return "Q";
      if (file === "e") return "K";
    }
    
    // Default to pawn (this wouldn't happen in a real game)
    return "P";
  }
  
  // Example usage:
  // lanToSan("e2e4") => "e4"
  // lanToSan("b1c3") => "Nc3"
  // lanToSan("e7e8q") => "e8=Q"