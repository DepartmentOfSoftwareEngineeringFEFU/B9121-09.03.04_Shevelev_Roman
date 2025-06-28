import {
  applyMoveToPieces,
  coordsToSquareNumber,
  squareNumberToCoords,
} from "./checkersUtils";

function getAllMoves(
  boardState,
  isWhite,
  forcedSquare = null,
  singleStep = false
) {
  const color = isWhite ? "W" : "B";
  const pieces = boardState.pieces;
  const moves = [];
  const allCaptures = [];

  function findCaptures(
    fromSquare,
    pieceType,
    visited,
    path,
    capturedList,
    boardPieces,
    singleStepMode
  ) {
    const isKing = pieceType.includes("K");
    const fromCoords = squareNumberToCoords(fromSquare);
    const directions = [
      { rowStep: 1, colStep: 1 },
      { rowStep: 1, colStep: -1 },
      { rowStep: -1, colStep: 1 },
      { rowStep: -1, colStep: -1 },
    ];
    let found = false;
    if (!isKing) {
      for (const dir of directions) {
        const jumpRow = fromCoords.row + 2 * dir.rowStep;
        const jumpCol = fromCoords.col + 2 * dir.colStep;
        const captureRow = fromCoords.row + dir.rowStep;
        const captureCol = fromCoords.col + dir.colStep;
        const jumpSquare = coordsToSquareNumber(jumpRow, jumpCol);
        const captureSquare = coordsToSquareNumber(captureRow, captureCol);
        if (
          jumpSquare &&
          captureSquare &&
          boardPieces[captureSquare] &&
          !boardPieces[jumpSquare] &&
          boardPieces[captureSquare][0] !== color &&
          !visited.has(captureSquare)
        ) {
          const newPieces = { ...boardPieces };
          delete newPieces[fromSquare];
          delete newPieces[captureSquare];
          newPieces[jumpSquare] = pieceType;
          const newVisited = new Set(visited);
          newVisited.add(captureSquare);
          const newPath = [...path, jumpSquare];
          const newCaptured = [...capturedList, captureSquare];
          if (singleStepMode) {
            allCaptures.push({
              type: "capture",
              from: path[0],
              captures: [jumpSquare],
              captured: [captureSquare],
            });
          } else {
            const further = findCaptures(
              jumpSquare,
              pieceType,
              newVisited,
              newPath,
              newCaptured,
              newPieces,
              false
            );
            if (!further) {
              allCaptures.push({
                type: "capture",
                from: path[0],
                captures: newPath.slice(1),
                captured: newCaptured,
              });
            }
          }
          found = true;
        }
      }
    } else {
      for (const dir of directions) {
        let currentRow = fromCoords.row + dir.rowStep;
        let currentCol = fromCoords.col + dir.colStep;
        let foundPiece = false;
        let captureSquare = null;
        while (
          currentRow >= 0 &&
          currentRow <= 7 &&
          currentCol >= 0 &&
          currentCol <= 7
        ) {
          const checkSquare = coordsToSquareNumber(currentRow, currentCol);
          if (!checkSquare) break;
          if (boardPieces[checkSquare]) {
            if (
              !foundPiece &&
              boardPieces[checkSquare][0] !== color &&
              !visited.has(checkSquare)
            ) {
              foundPiece = true;
              captureSquare = checkSquare;
            } else {
              break;
            }
          } else if (foundPiece) {
            const newPieces = { ...boardPieces };
            delete newPieces[fromSquare];
            delete newPieces[captureSquare];
            newPieces[checkSquare] = pieceType;
            const newVisited = new Set(visited);
            newVisited.add(captureSquare);
            const newPath = [...path, checkSquare];
            const newCaptured = [...capturedList, captureSquare];
            if (singleStepMode) {
              allCaptures.push({
                type: "capture",
                from: path[0],
                captures: [checkSquare],
                captured: [captureSquare],
              });
            } else {
              const further = findCaptures(
                checkSquare,
                pieceType,
                newVisited,
                newPath,
                newCaptured,
                newPieces,
                false
              );
              if (!further) {
                allCaptures.push({
                  type: "capture",
                  from: path[0],
                  captures: newPath.slice(1),
                  captured: newCaptured,
                });
              }
            }
            found = true;
          }
          currentRow += dir.rowStep;
          currentCol += dir.colStep;
        }
      }
    }
    return found;
  }

  Object.entries(pieces).forEach(([square, piece]) => {
    if (!piece.startsWith(color)) return;
    const fromSquare = parseInt(square);
    if (forcedSquare && fromSquare !== forcedSquare) return;
    findCaptures(
      fromSquare,
      piece,
      new Set(),
      [fromSquare],
      [],
      pieces,
      singleStep
    );
  });

  if (allCaptures.length > 0) {
    if (!singleStep) {
      const maxLen = Math.max(...allCaptures.map((c) => c.captured.length));
      const bestCaptures = allCaptures.filter(
        (c) => c.captured.length === maxLen
      );
      bestCaptures.sort((a, b) => b.captured.length - a.captured.length);
      return bestCaptures.map((move) => ({
        move,
        newBoard: { ...boardState, pieces: applyMoveToPieces(pieces, move) },
      }));
    } else {
      return allCaptures.map((move) => ({
        move,
        newBoard: { ...boardState, pieces: applyMoveToPieces(pieces, move) },
      }));
    }
  }

  Object.entries(pieces).forEach(([square, piece]) => {
    if (!piece.startsWith(color)) return;
    if (forcedSquare && parseInt(square) !== forcedSquare) return;
    const fromSquare = parseInt(square);
    const fromCoords = squareNumberToCoords(fromSquare);
    const isKing = piece.includes("K");
    const directions = [
      { rowStep: 1, colStep: 1 },
      { rowStep: 1, colStep: -1 },
      { rowStep: -1, colStep: 1 },
      { rowStep: -1, colStep: -1 },
    ];
    for (const dir of directions) {
      if (
        !isKing &&
        ((color === "W" && dir.rowStep > 0) ||
          (color === "B" && dir.rowStep < 0))
      )
        continue;
      const toRow = fromCoords.row + dir.rowStep;
      const toCol = fromCoords.col + dir.colStep;
      const toSquare = coordsToSquareNumber(toRow, toCol);
      if (toSquare && !pieces[toSquare]) {
        let pathClear = true;
        if (isKing) {
          const steps = Math.max(
            Math.abs(toRow - fromCoords.row),
            Math.abs(toCol - fromCoords.col)
          );
          for (let i = 1; i < steps; i++) {
            const checkRow = fromCoords.row + i * dir.rowStep;
            const checkCol = fromCoords.col + i * dir.colStep;
            const checkSquare = coordsToSquareNumber(checkRow, checkCol);
            if (checkSquare && pieces[checkSquare]) {
              pathClear = false;
              break;
            }
          }
        }
        if (pathClear) {
          moves.push({
            type: "move",
            from: fromSquare,
            to: toSquare,
          });
        }
      }
    }
  });
  return moves.map((move) => ({
    move,
    newBoard: { ...boardState, pieces: applyMoveToPieces(pieces, move) },
  }));
}

export function getInitialFenByLevel(level) {
  return "W:W21,22,23,24,25,26,27,28,29,30,31,32:B1,2,3,4,5,6,7,8,9,10,11,12";
}

export { getAllMoves };
