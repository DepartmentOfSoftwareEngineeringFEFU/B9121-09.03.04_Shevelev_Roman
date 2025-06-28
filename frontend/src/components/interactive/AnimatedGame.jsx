import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CheckersBoard from "../CheckersBoard";
import { parseFen, parseMoves, applyMoveToPieces, formatMoveToString } from "../../utils/checkersUtils";

const AnimatedGameContainer = styled.div`
  border: 2px solid #8b4513;
  background-color: rgba(160, 82, 45, 0.1);
  border-radius: 10px;
  padding: 20px;
  margin: 20px auto;
  width: fit-content;
  text-align: center;
`;

const GameTitle = styled.h3`
  color: #ffffff;
  margin-top: 0;
  margin-bottom: 15px;
`;

const Controls = styled.div`
  margin-top: 15px;
`;

const ControlButton = styled.button`
  background-color: #d2b48c;
  color: #8b4513;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 5px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #ffd700;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const MoveInfo = styled.p`
  color: #ffffff;
  font-family: monospace;
  margin: 10px 0;
`;

const AnimatedGame = ({ fen, moves }) => {
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [piecePositions, setPiecePositions] = useState({});
  const [moveHistory, setMoveHistory] = useState([]);
  const parsedMoves = parseMoves(moves);

  useEffect(() => {
    const initialPosition = parseFen(fen);
    setPiecePositions(initialPosition.pieces);
    setMoveHistory([initialPosition.pieces]);
  }, [fen]);

  useEffect(() => {
    let intervalId;
    if (isPlaying && currentMoveIndex < parsedMoves.length - 1) {
      intervalId = setInterval(() => {
        setCurrentMoveIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex < parsedMoves.length) {
            const nextPieces = applyMoveToPieces(piecePositions, parsedMoves[nextIndex]);
            setPiecePositions(nextPieces);
            setMoveHistory((prev) => [...prev, nextPieces]);
            return nextIndex;
          } else {
            setIsPlaying(false);
            return prevIndex;
          }
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, currentMoveIndex, parsedMoves, piecePositions]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextMove = () => {
    if (currentMoveIndex < parsedMoves.length - 1) {
      const nextIndex = currentMoveIndex + 1;
      const nextPieces = applyMoveToPieces(piecePositions, parsedMoves[nextIndex]);
        setPiecePositions(nextPieces);
      setMoveHistory((prev) => [...prev, nextPieces]);
      setCurrentMoveIndex(nextIndex);
    }
  };

  const handlePrevMove = () => {
    if (currentMoveIndex >= 0) {
      const prevIndex = currentMoveIndex - 1;
      const prevPieces = moveHistory[prevIndex + 1];
      setPiecePositions(prevPieces);
      setCurrentMoveIndex(prevIndex);
    }
  };

  const handleReset = () => {
    setCurrentMoveIndex(-1);
    setIsPlaying(false);
    setPiecePositions(parseFen(fen).pieces);
    setMoveHistory([parseFen(fen).pieces]);
  };

  const handleEndGame = () => {
    let currentPieces = parseFen(fen).pieces;
    const newHistory = [currentPieces];

    for (const move of parsedMoves) {
      currentPieces = applyMoveToPieces(currentPieces, move);
      newHistory.push({ ...currentPieces });
    }

    setPiecePositions(currentPieces);
    setMoveHistory(newHistory);
    setCurrentMoveIndex(parsedMoves.length - 1);
    setIsPlaying(false);
  };

  const getCurrentMove = () => {
    if (currentMoveIndex >= 0 && currentMoveIndex < parsedMoves.length) {
      return formatMoveToString(parsedMoves[currentMoveIndex], true);
    }
    return "";
  };

  return (
    <AnimatedGameContainer>
      <GameTitle>Анимированная последовательность ходов</GameTitle>
      <CheckersBoard pieces={piecePositions} />
      <MoveInfo>
        Ход {currentMoveIndex + 1} из {parsedMoves.length}
        {getCurrentMove() && ` (${getCurrentMove()})`}
      </MoveInfo>
      <Controls>
        <ControlButton onClick={handleReset} disabled={currentMoveIndex === -1}>
          В начало
        </ControlButton>
        <ControlButton onClick={handlePrevMove} disabled={currentMoveIndex === -1}>
          Назад
        </ControlButton>
        <ControlButton onClick={handlePlayPause}>
          {isPlaying ? "Пауза" : "Воспроизвести"}
        </ControlButton>
        <ControlButton
          onClick={handleNextMove}
          disabled={currentMoveIndex >= parsedMoves.length - 1}
        >
          Вперед
        </ControlButton>
        <ControlButton
          onClick={handleEndGame}
          disabled={currentMoveIndex === parsedMoves.length - 1}
        >
          В конец
        </ControlButton>
      </Controls>
    </AnimatedGameContainer>
  );
};

export default AnimatedGame;
