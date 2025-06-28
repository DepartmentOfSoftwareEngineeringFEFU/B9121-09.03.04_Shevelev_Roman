export const squareNumberToCoords = (number) => {
  if (number < 1 || number > 32) {
    return null;
  }
  const index = number - 1;
  const row = Math.floor(index / 4);
  const col = row % 2 === 0 ? (index % 4) * 2 + 1 : (index % 4) * 2;
  return { row, col };
};

export const coordsToSquareNumber = (row, col) => {
  if (row < 0 || row > 7 || col < 0 || col > 7) {
    return null;
  }
  if ((row + col) % 2 === 0) {
    return null;
  }
  const baseIndexInRow = Math.floor(col / 2);
  const index = row * 4 + baseIndexInRow;
  return index + 1;
};

export const parseFen = (fen) => {
  const boardState = {
    turn: null,
    pieces: {},
  };
  if (!fen) return boardState;
  const parts = fen.split(":");
  if (parts.length < 2) {
    return boardState;
  }
  boardState.turn = parts[0] || "W";
  for (let i = 1; i < parts.length; i++) {
    const piecePart = parts[i];
    if (!piecePart || piecePart.length < 2) continue;
    const pieceColor = piecePart[0];
    const squaresString = piecePart.substring(1);
    const squares = squaresString.split(",");
    squares.forEach((square) => {
      let squareNumStr = square;
      let isKing = false;
      if (squareNumStr.includes("K")) {
        isKing = true;
        squareNumStr = squareNumStr.replace("K", "");
      }
      let num;
      if (/^[a-h][1-8]$/i.test(squareNumStr)) {
        num = algebraicToNumber(squareNumStr);
      } else {
        num = parseInt(squareNumStr, 10);
      }
      if (!isNaN(num) && num >= 1 && num <= 32) {
        boardState.pieces[num] = pieceColor + (isKing ? "K" : "");
      }
    });
  }
  return boardState;
};

export const parseMoves = (movesString) => {
  if (!movesString) return [];
  return movesString
    .split(",")
    .map((move) => {
      move = move.trim();

      if (move.includes("x")) {
        const parts = move.split("x");

        const fromAlg = algebraicToNumber(parts[0]);
        if (fromAlg !== null) {
          const captures = parts
            .slice(1)
            .map(algebraicToNumber)
            .filter((n) => n !== null);
          if (captures.length > 0) {
            return { type: "capture", from: fromAlg, captures };
          }
        } else {
          const from = Number(parts[0]);
          const captures = parts.slice(1).map(Number);
          if (
            !isNaN(from) &&
            captures.length > 0 &&
            captures.every((num) => !isNaN(num))
          ) {
            return { type: "capture", from, captures };
          }
        }
      } else if (move.includes("-")) {
        const [fromStr, toStr] = move.split("-");

        const fromAlg = algebraicToNumber(fromStr);
        const toAlg = algebraicToNumber(toStr);
        if (fromAlg !== null && toAlg !== null) {
          return { type: "move", from: fromAlg, to: toAlg };
        } else {
          const from = Number(fromStr);
          const to = Number(toStr);
          if (!isNaN(from) && !isNaN(to)) {
            return { type: "move", from, to };
          }
        }
      }
      console.warn(`Неизвестный формат хода: ${move}`);
      return null;
    })
    .filter((move) => move !== null);
};

export const formatMoveToString = (move) => {
  if (!move) return "";
  if (move.type === "move") {
    const fromAlg = numberToAlgebraic(move.from);
    const toAlg = numberToAlgebraic(move.to);
    return `${fromAlg}-${toAlg}`;
  } else if (move.type === "capture") {
    const fromAlg = numberToAlgebraic(move.from);
    const capturesAlg = move.captures.map(numberToAlgebraic);
    return `${fromAlg}x${capturesAlg.join("x")}`;
  }
  return "";
};

export const applyMoveToPieces = (currentPieces, move) => {
  const newPieces = { ...currentPieces };

  if (move.type === "move") {
    const pieceType = newPieces[move.from];
    if (pieceType) {
      delete newPieces[move.from];
      newPieces[move.to] = pieceType;
    }
  } else if (move.type === "capture") {
    const movingPieceType = newPieces[move.from];
    if (movingPieceType) {
      const movingPieceColor = movingPieceType[0];

      delete newPieces[move.from];
      const lastSquare = move.captures[move.captures.length - 1];
      newPieces[lastSquare] = movingPieceType;

      if (move.captures.length === 1) {
        const fromCoords = squareNumberToCoords(move.from);
        const toCoords = squareNumberToCoords(move.captures[0]);

        if (fromCoords && toCoords) {
          const rowStep = toCoords.row > fromCoords.row ? 1 : -1;
          const colStep = toCoords.col > fromCoords.col ? 1 : -1;

          let currentRow = fromCoords.row;
          let currentCol = fromCoords.col;

          while (currentRow !== toCoords.row && currentCol !== toCoords.col) {
            currentRow += rowStep;
            currentCol += colStep;

            if (currentRow !== toCoords.row && currentCol !== toCoords.col) {
              const capturedSquare = coordsToSquareNumber(
                currentRow,
                currentCol
              );

              if (capturedSquare && newPieces[capturedSquare]) {
                const capturedPieceColor = newPieces[capturedSquare][0];
                if (capturedPieceColor !== movingPieceColor) {
                  delete newPieces[capturedSquare];
                }
              }
            }
          }
        }
      } else {
        let currentFrom = move.from;
        for (const capture of move.captures) {
          const fromCoords = squareNumberToCoords(currentFrom);
          const toCoords = squareNumberToCoords(capture);

          if (fromCoords && toCoords) {
            const rowStep = toCoords.row > fromCoords.row ? 1 : -1;
            const colStep = toCoords.col > fromCoords.col ? 1 : -1;

            let currentRow = fromCoords.row;
            let currentCol = fromCoords.col;

            while (currentRow !== toCoords.row && currentCol !== toCoords.col) {
              currentRow += rowStep;
              currentCol += colStep;

              if (currentRow !== toCoords.row && currentCol !== toCoords.col) {
                const capturedSquare = coordsToSquareNumber(
                  currentRow,
                  currentCol
                );

                if (capturedSquare && newPieces[capturedSquare]) {
                  const capturedPieceColor = newPieces[capturedSquare][0];
                  if (capturedPieceColor !== movingPieceColor) {
                    delete newPieces[capturedSquare];
                  }
                }
              }
            }
          }
          currentFrom = capture;
        }
      }
    }
  }

  Object.entries(newPieces).forEach(([square, piece]) => {
    const coords = squareNumberToCoords(parseInt(square, 10));
    if (coords) {
      if (piece === "W" && coords.row === 0) {
        newPieces[square] = "WK";
      } else if (piece === "B" && coords.row === 7) {
        newPieces[square] = "BK";
      }
    }
  });

  return newPieces;
};

export const algebraicToCoords = (algebraic) => {
  if (!algebraic || algebraic.length !== 2) return null;
  const col = algebraic.toLowerCase().charCodeAt(0) - "a".charCodeAt(0);
  const row = 8 - parseInt(algebraic[1]);
  if (col < 0 || col > 7 || row < 0 || row > 7) return null;
  return { row, col };
};

export const coordsToAlgebraic = (coords) => {
  if (
    !coords ||
    coords.row < 0 ||
    coords.row > 7 ||
    coords.col < 0 ||
    coords.col > 7
  )
    return null;
  const letter = String.fromCharCode("a".charCodeAt(0) + coords.col);
  const number = 8 - coords.row;
  return `${letter}${number}`;
};

export const algebraicToNumber = (algebraic) => {
  const coords = algebraicToCoords(algebraic);
  if (!coords) return null;
  return coordsToSquareNumber(coords.row, coords.col);
};

export const numberToAlgebraic = (number) => {
  const coords = squareNumberToCoords(number);
  if (!coords) return null;
  return coordsToAlgebraic(coords);
};

export const boardStateToFen = (boardState) => {
  const { turn, pieces } = boardState;
  let w = [],
    wk = [],
    b = [],
    bk = [];
  Object.entries(pieces).forEach(([num, piece]) => {
    const n = parseInt(num, 10);
    if (piece === "W") w.push(numberToAlgebraic(n));
    else if (piece === "WK") wk.push(numberToAlgebraic(n) + "K");
    else if (piece === "B") b.push(numberToAlgebraic(n));
    else if (piece === "BK") bk.push(numberToAlgebraic(n) + "K");
  });
  let fen = (turn || "W") + ":";
  if (w.length > 0) fen += "W" + w.join(",");
  if (wk.length > 0) fen += (w.length > 0 ? "," : "") + "W" + wk.join(",");
  if (b.length > 0 || bk.length > 0) fen += ":";
  if (b.length > 0) fen += "B" + b.join(",");
  if (bk.length > 0) fen += (b.length > 0 ? "," : "") + "B" + bk.join(",");
  return fen;
};
