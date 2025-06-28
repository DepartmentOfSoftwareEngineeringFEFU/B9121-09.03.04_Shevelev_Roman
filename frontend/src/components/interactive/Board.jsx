import React, { useMemo } from "react";
import styled from "styled-components";
import Draughts from "draughts-js";

const BoardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  width: 100%;
  max-width: 400px;
  margin: 20px auto;
  aspect-ratio: 1 / 1;
  border: 5px solid #a0522d;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  user-select: none;
`;

const Square = styled.div`
  width: 100%;
  height: 100%;

  background-color: ${({ isDark }) => (isDark ? "#8B4513" : "#F5F5DC")};
  position: relative;
`;

const Piece = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  border-radius: 50%;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);

  background-color: ${({ color }) => (color === "W" ? "#F5F5DC" : "#111111")};
  border: 2px solid ${({ color }) => (color === "W" ? "#A0522D" : "#666")};

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40%;
    height: 40%;
    border-radius: 50%;
    background-color: ${({ isKing, color }) =>
      isKing ? (color === "W" ? "#FFD700" : "#444") : "transparent"};
  }
`;

const Board = ({ fen, onSquareClick, onPieceDragStart }) => {
  const boardState = useMemo(() => {
    try {
      const draughtsGame = new Draughts.FEN(fen);
      return draughtsGame.board;
    } catch (e) {
      console.error("Неверный FEN:", fen, e);
      return null;
    }
  }, [fen]);

  if (!boardState) {
    return <div>Неверный формат доски (FEN).</div>;
  }

  const squares = [];
  for (let rank = 8; rank >= 1; rank--) {
    for (let file = 1; file <= 8; file++) {
      const squareName = `${String.fromCharCode(96 + file)}${rank}`;

      const isDark = (file + rank) % 2 !== 0;

      const piece = boardState.find(
        (p) => p.square === Draughts.Notation.toStandard(squareName)
      );

      squares.push(
        <Square
          key={squareName}
          isDark={isDark}
          onClick={() => isDark && onSquareClick && onSquareClick(squareName)}
        >
          {isDark && piece && (
            <Piece color={piece.color} isKing={piece.isKing} />
          )}
          </Square>
      );
    }
  }

  return <BoardContainer>{squares}</BoardContainer>;
};

export default Board;
