import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import CheckersBoard from "../CheckersBoard";
import {
  parseFen,
  formatMoveToString,
  parseMoves,
} from "../../utils/checkersUtils";
import {
  getAllMoves,
  getInitialFenByLevel,
} from "../../utils/checkersTrainerAI";
import { getBestMove } from "../../utils/ml-service";
import { numberToAlgebraic } from "../../utils/checkersUtils";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  background-color: rgba(245, 245, 220, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Controls = styled.div`
  margin: 20px 0;
  display: flex;
  gap: 20px;
`;

const Select = styled.select`
  padding: 8px 12px;
  border-radius: 5px;
  border: 1px solid #a0522d;
  font-size: 1rem;
`;

const Button = styled.button`
  background-color: #ffd700;
  color: #8b4513;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.2s;
  &:hover {
    background-color: #a0522d;
    color: #fff;
  }
`;

const Status = styled.div`
  margin: 15px 0;
  font-size: 1.1rem;
  color: #8b4513;
`;

const HistoryList = styled.ul`
  margin-top: 20px;
  padding: 0;
  list-style: none;
  width: 100%;
  max-width: 400px;
  background: #f5f5dc;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(160, 82, 45, 0.08);
  
`;

const HistoryItem = styled.li`
  padding: 8px 12px;
  border-bottom: 1px solid #e0cfa9;
  color: #8b4513;
  font-size: 1rem;
  background: ${({ by }) => (by === "AI" ? "#ffe0b2" : "#fffde7")};
`;

const GameArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 32px;
`;

const HistoryPanel = styled.div`
  margin-top: 20px;
  min-width: 220px;
  max-width: 300px;
  min-height: 390px;
  max-height: 390px;
  background: #f5f5dc;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(160, 82, 45, 0.08);
  padding: 0 16px 16px 16px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    margin: 5px 0;
  }

  &::-webkit-scrollbar-thumb {
    background: #8b4513;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a0522d;
  }
`;

const HistoryTitle = styled.div`
  position: sticky;
  top: 0;
  margin: 0;
  background-color: #f5f5dc;
  font-weight: bold;
  margin-bottom: 10px;
  color: #8b4513;
  padding: 15px;
`;

function boardStateToFenGo(boardState) {
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
  if (w.length > 0 || wk.length > 0) {
    fen += "W";
    fen += w.join(",");
    if (wk.length > 0) {
      if (w.length > 0) fen += ",";
      fen += wk.join(",");
    }
  }
  if (b.length > 0 || bk.length > 0) {
    fen += ":B";
    fen += b.join(",");
    if (bk.length > 0) {
      if (b.length > 0) fen += ",";
      fen += bk.join(",");
    }
  }
  return fen;
}

const TrainerGame = () => {
  const [difficulty, setDifficulty] = useState("medium");
  const [fen, setFen] = useState(getInitialFenByLevel("medium"));
  const [boardState, setBoardState] = useState(parseFen(fen));
  const [isAITurn, setIsAITurn] = useState(false);
  const [status, setStatus] = useState("Ваш ход");
  const [history, setHistory] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const historyPanelRef = useRef(null);

  useEffect(() => {
    if (historyPanelRef.current) {
      historyPanelRef.current.scrollTop = historyPanelRef.current.scrollHeight;
    }
  }, [history]);

  const resetGame = (fenValue) => {
    setBoardState(parseFen(fenValue));
    setIsAITurn(false);
    setStatus("Ваш ход");
    setHistory([]);
    setSelectedSquare(null);
    setGameOver(false);
  };

  useEffect(() => {
    if (isAITurn && !gameOver) {
      if (boardState.turn !== "B") {
        setIsAITurn(false);
        return;
      }
      setStatus("Ход компьютера...");
      setTimeout(async () => {
        try {
          const fenStr = boardStateToFenGo(boardState);
          const { move, new_fen } = await getBestMove(
            fenStr,
            difficulty === "easy" ? 2 : difficulty === "medium" ? 6 : 10
          );
          if (!move || !new_fen) {
            setStatus("Компьютер не может сделать ход. Вы победили!");
            setIsAITurn(false);
            setGameOver(true);
            return;
          }
          setFen(new_fen);
          const newBoardState = parseFen(new_fen);
          setBoardState(newBoardState);
          setHistory((h) => [
            ...h,
            { move: parseMoves(move.replace(/:/g, "x"))[0], by: "AI" },
          ]);
          if (getAllMoves(newBoardState, true).length === 0) {
            setStatus("Вы не можете сделать ход. Компьютер победил!");
            setGameOver(true);
          } else {
            setIsAITurn(false);
            setStatus("Ваш ход");
          }
        } catch (e) {
          setStatus("Ошибка связи с сервером");
          setIsAITurn(false);
          setGameOver(true);
        }
      }, 500);
    }
  }, [isAITurn, boardState, difficulty, gameOver]);

  const handleSquareClick = (squareNumber) => {
    if (isAITurn || gameOver) return;
    const pieces = boardState.pieces;
    const piece = pieces[squareNumber];
	
    if (piece && piece.startsWith("W")) {
      setSelectedSquare(squareNumber);
      return;
    }
    
	if (selectedSquare && !pieces[squareNumber]) {
      const allMoves = getAllMoves(boardState, true, null, true);
      
	  const moveObj = allMoves.find(({ move }) => {
        if (move.type === "move") {
          return move.from === selectedSquare && move.to === squareNumber;
        } else if (move.type === "capture") {
          return (
            move.from === selectedSquare && move.captures[0] === squareNumber
          );
        }
        return false;
      });
      if (moveObj) {
        const newBoard = { ...moveObj.newBoard, turn: "B" };
        setBoardState(newBoard);
        setHistory((h) => [...h, { move: moveObj.move, by: "user" }]);
        
		if (moveObj.move.type === "capture") {
          const lastSquare = moveObj.move.captures[0];
          const nextCaptures = getAllMoves(
            newBoard,
            true,
            lastSquare,
            true
          ).filter(
            ({ move }) => move.type === "capture" && move.from === lastSquare
          );
          if (nextCaptures.length > 0) {
            setSelectedSquare(lastSquare);
            setStatus("Продолжайте серию взятий этой шашкой");
            return;
          }
        }
        setSelectedSquare(null);
        
		if (getAllMoves(newBoard, false).length === 0) {
          setStatus("Компьютер не может сделать ход. Вы победили!");
          setGameOver(true);
        } else {
          setIsAITurn(true);
        }
      } else {
        setStatus("Недопустимый ход");
        setTimeout(() => setStatus("Ваш ход"), 1000);
        setSelectedSquare(null);
      }
    }
  };

  const handleNewGame = () => {
    const newFen = getInitialFenByLevel(difficulty);
    setFen(newFen);
    resetGame(newFen);
  };

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
    setFen(getInitialFenByLevel(e.target.value));
  };

  return (
    <Container>
      <h2>Тренажёр: игра с компьютером</h2>
      <Controls>
        <Select value={difficulty} onChange={handleDifficultyChange}>
          <option value="easy">Лёгкий</option>
          <option value="medium">Средний</option>
          <option value="hard">Сложный</option>
        </Select>
        <Button onClick={handleNewGame}>Новая партия</Button>
      </Controls>
      <Status>{status}</Status>
      <GameArea>
        <CheckersBoard
          pieces={boardState.pieces}
          interactive={!isAITurn && !gameOver}
          onSquareClick={handleSquareClick}
          selectedSquare={selectedSquare}
        />
        <HistoryPanel ref={historyPanelRef}>
          <HistoryTitle>История ходов</HistoryTitle>
          <HistoryList>
            {history.map((h, idx) => (
              <HistoryItem key={idx} by={h.by}>
                {h.by === "AI" ? "Компьютер: " : "Вы: "}
                {formatMoveToString(h.move)}
              </HistoryItem>
            ))}
          </HistoryList>
        </HistoryPanel>
      </GameArea>
    </Container>
  );
};

export default TrainerGame;
