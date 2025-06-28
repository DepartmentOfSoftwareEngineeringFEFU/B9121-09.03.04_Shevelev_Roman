import React from "react";
import styled from "styled-components";
import { coordsToSquareNumber } from "../utils/checkersUtils";

import simpleBlack from "../pages/images/simple_black.svg";
import simpleWhite from "../pages/images/simple_white.svg";
import kingBlack from "../pages/images/king_black.svg";
import kingWhite from "../pages/images/king_white.svg";

const BoardGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2em repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr) 1.2em;
  width: 100%;
  max-width: 400px;
  margin: 20px auto;
  aspect-ratio: 1 / 1;
  border: 5px solid #8b4513;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3);
  padding: 0;
  gap: 0;
  background-color: #f5f5dc;
`;

const Square = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ isDark }) => (isDark ? "#A0522D" : "#F5F5DC")};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${({ isInteractive }) => (isInteractive ? "pointer" : "default")};
  position: relative;
  ${({ isSelected }) =>
    isSelected &&
    `
    border: 2px solid #FFD700;
  `}
`;

const Piece = styled.img`
  width: 80%;
  height: 80%;
  object-fit: contain;
  position: relative;
  z-index: 2;
`;

const CoordLabel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #8b4513;
  font-size: 0.9rem;
  font-weight: bold;
  user-select: none;
  grid-column: ${(props) => props.col};
  grid-row: ${(props) => props.row};
  background: none;
  padding: 4px;
  text-shadow: none;
  z-index: 1;
`;

const CheckersBoard = ({
  pieces,
  onSquareClick,
  interactive = false,
  selectedSquare = null,
}) => {
  const squares = [];
  const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const numbers = ["8", "7", "6", "5", "4", "3", "2", "1"];

  numbers.forEach((num, index) => {
    squares.push(
      <CoordLabel key={`row-${num}`} col="1" row={index + 1}>
        {num}
      </CoordLabel>
    );
  });

  letters.forEach((letter, index) => {
    squares.push(
      <CoordLabel key={`col-${letter}`} col={index + 2} row="9">
        {letter}
      </CoordLabel>
    );
  });

  for (let i = 0; i < 64; i++) {
    const row = Math.floor(i / 8);
    const col = i % 8;
    const isDark = (row + col) % 2 !== 0;

    let squareNumber = null;
    let piece = null;
    let pieceType = null;
    let hasPiece = false;

    if (isDark) {
      squareNumber = coordsToSquareNumber(row, col);
      if (squareNumber && pieces && pieces[squareNumber]) {
        pieceType = pieces[squareNumber];
        hasPiece = true;
        if (pieceType === "W") piece = simpleWhite;
        else if (pieceType === "B") piece = simpleBlack;
        else if (pieceType === "WK") piece = kingWhite;
        else if (pieceType === "BK") piece = kingBlack;
      }
    }

    const isSelected =
      selectedSquare !== null && selectedSquare === squareNumber;

    squares.push(
      <Square
        key={`square-${row}-${col}`}
        isDark={isDark}
        isInteractive={interactive && isDark}
        onClick={
          interactive && isDark ? () => onSquareClick(squareNumber) : null
        }
        isSelected={isSelected}
        hasPiece={hasPiece}
        style={{
          gridColumn: col + 2,
          gridRow: row + 1,
        }}
      >
        {piece && <Piece src={piece} alt={pieceType} />}
      </Square>
    );
  }

  return <BoardGrid>{squares}</BoardGrid>;
};

export default CheckersBoard;
