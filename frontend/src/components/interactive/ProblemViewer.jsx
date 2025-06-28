import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import CheckersBoard from "../CheckersBoard";
import {
  parseFen,
  applyMoveToPieces,
  formatMoveToString,
  squareNumberToCoords,
  coordsToSquareNumber,
} from "../../utils/checkersUtils";
import Swal from "sweetalert2";

const DifficultyBadge = styled.div`
  background-color: ${(props) => {
    switch (props.difficulty?.toLowerCase()) {
      case "easy":
        return "#4CAF50";
      case "medium":
        return "#FF9800";
      case "hard":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  }};
  color: white;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 15px;
  display: inline-block;
`;

const getDifficultyText = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "Легкая задача";
    case "medium":
      return "Средняя задача";
    case "hard":
      return "Сложная задача";
    default:
      return "Задача";
  }
};

const ProblemContainer = styled.div`
  border: 2px solid #8b4513;
  background-color: rgba(160, 82, 45, 0.1);
  border-radius: 10px;
  padding: 20px;
  margin: 20px auto;
  width: fit-content;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-width: 500px;
  min-height: 800px;
`;

const ProblemTitle = styled.h3`
  color: #8b4513;
  margin-top: 0;
  margin-bottom: 15px;
`;
const ActionButton = styled.button`
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

const NavigationButton = styled(ActionButton)`
  margin: 0 10px;
  background-color: #8b4513;
  color: #fff;

  &:hover {
    background-color: #654321;
  }

  &:disabled {
    background-color: #ccc;
    color: #666;
  }
`;

const UserMoveMessage = styled.p`
  font-size: 1rem;
  font-weight: bold;
  color: #8b4513;
  min-height: 1.2em;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

const NavigationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const ProblemDescription = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 5px;
  max-width: 600px;
  text-align: center;
  color: #333;
  font-size: 1rem;
  line-height: 1.5;
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 500;
  background-color: ${(props) => (props.isCompleted ? "#4CAF50" : "#FFA726")};
  color: white;
  transition: background-color 0.3s ease;
`;

const StatsContainer = styled.div`
  margin: 20px 0;
  padding: 15px;
  background-color: rgba(139, 69, 19, 0.1);
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 10px;
`;

const StatCard = styled.div`
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #8b4513;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const StatHeader = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: #8b4513;
  margin-bottom: 10px;
  text-align: center;
`;

const ProblemViewer = ({ problemId, categoryId, isLesson = false }) => {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [problems, setProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);

  const [currentPiecePositions, setCurrentPiecePositions] = useState(null);
  const [userAttemptedMoves, setUserAttemptedMoves] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [isProblemSolved, setIsProblemSolved] = useState(false);
  const [currentTurn, setCurrentTurn] = useState("W");
  const [moveCount, setMoveCount] = useState(0);

  const [startTime, setStartTime] = useState(null);
  const [problemStatus, setProblemStatus] = useState({
    isCompleted: false,
    completedAt: null,
    attempts: 0,
    bestTime: null,
    score: 0,
  });

  const checkCompleteSolution = useCallback(
    (moves) => {
      if (!problem) return false;
      const userMoveString = moves.map(formatMoveToString).join(",");
      const possibleSolutions = problem.Solution.split("|").map((solution) =>
        solution.trim()
      );
      const isSolutionCorrect = possibleSolutions.some(
        (solution) => userMoveString === solution
      );

      if (isSolutionCorrect) {
        setIsProblemSolved(true);
        setSelectedSquare(null);

        const timeSpent = Math.floor((Date.now() - startTime) / 1000);

        const submitSolutionAsync = async () => {
          try {
            const token = localStorage.getItem("token");
            if (!token) return;

            let baseScore =
              problem.Difficulty === "hard"
                ? 100
                : problem.Difficulty === "medium"
                ? 50
                : 25;

            if (timeSpent < 120) {
              baseScore += Math.floor((120 - timeSpent) / 6);
            }

            const response = await fetch(`/problems/${problemId}/complete`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                timeSpent,
                score: baseScore,
              }),
            });

            if (response.ok) {
              const data = await response.json();
              setProblemStatus(data.status);
            }
          } catch (error) {
            console.error("Error submitting solution:", error);
          }
        };

        submitSolutionAsync();

        Swal.fire({
          icon: "success",
          title: "Поздравляем!",
          text: `Вы успешно решили задачу за ${timeSpent} секунд!`,
        });
        return true;
      }
      return false;
    },
    [problem, startTime, problemId]
  );

  const handleResetAttempt = useCallback(() => {
    setUserAttemptedMoves([]);
    setCurrentPiecePositions(
      problem ? parseFen(problem.InitialPosition).pieces : null
    );
    setSelectedSquare(null);
    setIsProblemSolved(false);
    setIsGameEnded(false);
    setCurrentTurn(parseFen(problem.InitialPosition).turn);
    setMoveCount(0);
    setStartTime(Date.now());
    setCurrentTime(0);
  }, [problem]);

  const findForcedCaptures = useCallback(
    (pieces, color) => {
      if (
        (color === "W" && currentTurn === "B") ||
        (color === "B" && currentTurn === "W")
      ) {
        return [];
      }

      const forcedCaptures = [];

      Object.entries(pieces).forEach(([square, piece]) => {
        if (piece.startsWith(color)) {
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
            const jumpRow = fromCoords.row + 2 * dir.rowStep;
            const jumpCol = fromCoords.col + 2 * dir.colStep;
            const captureRow = fromCoords.row + dir.rowStep;
            const captureCol = fromCoords.col + dir.colStep;

            const jumpSquare = coordsToSquareNumber(jumpRow, jumpCol);
            const captureSquare = coordsToSquareNumber(captureRow, captureCol);

            if (jumpSquare && captureSquare) {
              const targetPiece = pieces[captureSquare];

              if (
                targetPiece &&
                targetPiece.startsWith(color === "W" ? "B" : "W") &&
                !pieces[jumpSquare]
              ) {
                const newPieces = { ...pieces };
                delete newPieces[captureSquare];
                newPieces[jumpSquare] = piece;

                const nextCaptures = findForcedCaptures(newPieces, color);
                const hasMoreCaptures = nextCaptures.some(
                  (c) => c.from === jumpSquare
                );

                forcedCaptures.push({
                  from: fromSquare,
                  to: jumpSquare,
                  capture: captureSquare,
                  hasMoreCaptures,
                  isKing,
                });
              }
            }
          }

          if (isKing) {
            for (const dir of directions) {
              for (let steps = 2; steps <= 7; steps++) {
                const jumpRow = fromCoords.row + steps * dir.rowStep;
                const jumpCol = fromCoords.col + steps * dir.colStep;

                let foundPiece = false;
                let captureSquare = null;

                for (let i = 1; i < steps; i++) {
                  const checkRow = fromCoords.row + i * dir.rowStep;
                  const checkCol = fromCoords.col + i * dir.colStep;
                  const checkSquare = coordsToSquareNumber(checkRow, checkCol);

                  if (checkSquare && pieces[checkSquare]) {
                    if (
                      !foundPiece &&
                      pieces[checkSquare].startsWith(color === "W" ? "B" : "W")
                    ) {
                      foundPiece = true;
                      captureSquare = checkSquare;
                    } else {
                      foundPiece = false;
                      break;
                    }
                  }
                }

                const jumpSquare = coordsToSquareNumber(jumpRow, jumpCol);
                if (foundPiece && jumpSquare && !pieces[jumpSquare]) {
                  const newPieces = { ...pieces };
                  delete newPieces[captureSquare];
                  newPieces[jumpSquare] = piece;

                  const nextCaptures = findForcedCaptures(newPieces, color);
                  const hasMoreCaptures = nextCaptures.some(
                    (c) => c.from === jumpSquare
                  );

                  forcedCaptures.push({
                    from: fromSquare,
                    to: jumpSquare,
                    capture: captureSquare,
                    hasMoreCaptures,
                    isKing,
                  });
                }
              }
            }
          }
        }
      });

      return forcedCaptures;
    },
    [currentTurn]
  );

  const checkGameEnd = useCallback(
    (pieces, lastMove = null) => {
      if (isGameEnded) return true;

      const whitePieces = Object.values(pieces).filter(
        (piece) => piece && piece.startsWith("W")
      ).length;
      const blackPieces = Object.values(pieces).filter(
        (piece) => piece && piece.startsWith("B")
      ).length;

      if (whitePieces === 0) {
        setTimeout(() => {
          setIsGameEnded(true);
          Swal.fire({
            icon: "error",
            title: "Задача не решена",
            text: "Все белые фигуры уничтожены. Попробуйте решить задачу заново.",
            confirmButtonText: "Начать заново",
          }).then((result) => {
            if (result.isConfirmed) {
              handleResetAttempt();
            }
          });
        }, 1000);
        return false;
      }

      if (blackPieces === 0) {
        setIsGameEnded(true);
        const allMoves = lastMove
          ? [...userAttemptedMoves, lastMove]
          : userAttemptedMoves;

        const currentMoves = allMoves.map(formatMoveToString).join(",");
        const possibleSolutions = problem.Solution.split("|").map((solution) =>
          solution.trim()
        );

        if (!possibleSolutions.some((solution) => currentMoves === solution)) {
          Swal.fire({
            icon: "info",
            title: "Поздравляем, ты победил!",
            text: "Но суть задачи заключалась не в этом... Попробуй еще раз.",
            confirmButtonText: "Начать заново",
          }).then((result) => {
            if (result.isConfirmed) {
              handleResetAttempt();
            }
          });
        } else {
          setIsProblemSolved(true);
          setSelectedSquare(null);
          checkCompleteSolution(allMoves);
          Swal.fire({
            icon: "success",
            title: "Поздравляем!",
            text: "Вы успешно решили задачу!",
          });
        }
        return true;
      }

      return false;
    },
    [
      isGameEnded,
      userAttemptedMoves,
      problem,
      handleResetAttempt,
      checkCompleteSolution,
    ]
  );

  const findBestBlackMove = useCallback(
    (pieces) => {
      if (!pieces) return null;

      const blackPieces = Object.entries(pieces)
        .filter(([_, piece]) => piece && piece.startsWith("B"))
        .map(([square]) => parseInt(square));

      let bestMove = null;
      let maxCaptures = 0;

      const forcedCaptures = findForcedCaptures(pieces, "B");
      if (forcedCaptures && forcedCaptures.length > 0) {
        for (const capture of forcedCaptures) {
          if (!capture) continue;

          const fromSquare = capture.from;
          const toSquare = capture.to;
          const capturedSquare = capture.capture;

          const move = {
            type: "capture",
            from: fromSquare,
            captures: [toSquare],
            captured: [capturedSquare],
          };

          const newPieces = applyMoveToPieces(pieces, move);
          const nextMove = findBestBlackMove(newPieces);

          if (nextMove && nextMove.type === "capture") {
            const totalCaptures =
              1 + (nextMove.captures ? nextMove.captures.length : 0);
            if (totalCaptures > maxCaptures) {
              maxCaptures = totalCaptures;
              bestMove = {
                type: "capture",
                from: fromSquare,
                captures: [toSquare, ...(nextMove.captures || [])],
                captured: [capturedSquare, ...(nextMove.captured || [])],
              };
            }
          } else if (maxCaptures === 0) {
            bestMove = move;
          }
        }
        return bestMove;
      }

      for (const fromSquare of blackPieces) {
        const fromCoords = squareNumberToCoords(fromSquare);
        const isKing = pieces[fromSquare].includes("K");

        const directions = [
          { rowStep: 1, colStep: 1 },
          { rowStep: 1, colStep: -1 },
          { rowStep: -1, colStep: 1 },
          { rowStep: -1, colStep: -1 },
        ];

        for (const dir of directions) {
          const jumpRow = fromCoords.row + 2 * dir.rowStep;
          const jumpCol = fromCoords.col + 2 * dir.colStep;
          const captureRow = fromCoords.row + dir.rowStep;
          const captureCol = fromCoords.col + dir.colStep;

          const jumpSquare = coordsToSquareNumber(jumpRow, jumpCol);
          const captureSquare = coordsToSquareNumber(captureRow, captureCol);

          if (jumpSquare && captureSquare) {
            const targetPiece = pieces[captureSquare];
            if (
              targetPiece &&
              targetPiece.startsWith("W") &&
              !pieces[jumpSquare]
            ) {
              const move = {
                type: "capture",
                from: fromSquare,
                captures: [jumpSquare],
                captured: [captureSquare],
              };
              const newPieces = applyMoveToPieces(pieces, move);

              const nextMove = findBestBlackMove(newPieces);
              const totalCaptures =
                1 +
                (nextMove && nextMove.captures ? nextMove.captures.length : 0);

              if (totalCaptures > maxCaptures) {
                maxCaptures = totalCaptures;
                if (nextMove) {
                  bestMove = {
                    type: "capture",
                    from: fromSquare,
                    captures: [jumpSquare, ...(nextMove.captures || [])],
                    captured: [captureSquare, ...(nextMove.captured || [])],
                  };
                } else {
                  bestMove = move;
                }
              }
            }
          }
        }

        if (!bestMove) {
          for (const dir of directions) {
            if (!isKing && dir.rowStep < 0) continue;

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
                bestMove = {
                  type: "move",
                  from: fromSquare,
                  to: toSquare,
                };
                break;
              }
            }
          }
        }
      }

      return bestMove;
    },
    [findForcedCaptures]
  );

  const makeBlackMove = useCallback(() => {
    if (isGameEnded || isProblemSolved) return;

    const bestMove = findBestBlackMove(currentPiecePositions);
    if (bestMove) {
      if (bestMove.type === "capture") {
        let currentFrom = bestMove.from;
        let moveIndex = 0;

        const makeNextCapture = () => {
          if (isGameEnded || isProblemSolved) return;

          if (bestMove.captures && moveIndex < bestMove.captures.length) {
            const singleCapture = {
              type: "capture",
              from: currentFrom,
              captures: [bestMove.captures[moveIndex]],
              captured:
                bestMove.captured && bestMove.captured[moveIndex]
                  ? [bestMove.captured[moveIndex]]
                  : [],
            };

            const newPieces = applyMoveToPieces(
              currentPiecePositions,
              singleCapture
            );

            if (checkGameEnd(newPieces, singleCapture)) {
              return;
            }

            setCurrentPiecePositions(newPieces);
            setUserAttemptedMoves((prev) => [...prev, singleCapture]);

            currentFrom = bestMove.captures[moveIndex];
            moveIndex++;

            if (moveIndex < bestMove.captures.length && !isGameEnded) {
              setTimeout(makeNextCapture, 500);
            } else if (!isGameEnded) {
              setCurrentTurn("W");
            }
          } else if (!isGameEnded) {
            setCurrentTurn("W");
          }
        };

        makeNextCapture();
      } else {
        const newPieces = applyMoveToPieces(currentPiecePositions, bestMove);

        if (checkGameEnd(newPieces, bestMove)) {
          return;
        }

        setCurrentPiecePositions(newPieces);
        setUserAttemptedMoves((prev) => [...prev, bestMove]);

        if (!isGameEnded) {
          setCurrentTurn("W");
        }
      }
    } else if (!isGameEnded) {
      setCurrentTurn("W");
    }
  }, [
    currentPiecePositions,
    findBestBlackMove,
    checkGameEnd,
    isGameEnded,
    isProblemSolved,
  ]);

  useEffect(() => {
    if (currentTurn === "B" && !isProblemSolved && !isGameEnded) {
      setTimeout(makeBlackMove, 500);
    }
  }, [currentTurn, isProblemSolved, isGameEnded, makeBlackMove]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await fetch(`/problems/${problemId}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError(`Задача с ID ${problemId} не найдена.`);
          } else {
            throw new Error(`Ошибка HTTP: ${response.status}`);
          }
        } else {
          const data = await response.json();
          setProblem(data);
          const boardState = parseFen(data.InitialPosition);
          setCurrentPiecePositions(boardState.pieces);
          setCurrentTurn(boardState.turn);
        }
      } catch (err) {
        console.error(`Ошибка при загрузке задачи с ID ${problemId}:`, err);
        setError("Не удалось загрузить задачу. Пожалуйста, попробуйте позже.");
        Swal.fire({
          icon: "error",
          title: "Ошибка загрузки задачи",
          text: "Не удалось загрузить содержимое задачи.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        if (!isLesson && categoryId) {
          const response = await fetch(
            `/api/categories/${categoryId}/problems`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch problems");
          }
          const data = await response.json();
          setProblems(data);
          const index = data.findIndex((p) => p.id === parseInt(problemId));
          setCurrentProblemIndex(index);
        }
      } catch (err) {
        console.error("Error fetching problems:", err);
        setError(err.message);
      }
    };

    fetchProblems();
  }, [categoryId, problemId, isLesson]);

  const navigateToProblem = useCallback(
    (index) => {
      if (index >= 0 && index < problems.length) {
        const nextProblem = problems[index];
        window.location.href = `/problems/${categoryId}/${nextProblem.id}`;
      }
    },
    [problems, categoryId]
  );

  const handlePreviousProblem = useCallback(() => {
    navigateToProblem(currentProblemIndex - 1);
  }, [currentProblemIndex, navigateToProblem]);

  const handleNextProblem = useCallback(() => {
    navigateToProblem(currentProblemIndex + 1);
  }, [currentProblemIndex, navigateToProblem]);

  const handleSquareClick = (squareNumber) => {
    if (isProblemSolved || isGameEnded || currentTurn === "B") return;

    const pieceOnSquare = currentPiecePositions[squareNumber];
    const playersTurn = currentTurn;

    if (selectedSquare !== null) {
      if (pieceOnSquare && pieceOnSquare.startsWith(playersTurn)) {
        setSelectedSquare(squareNumber);
        return;
      }

      const fromSquare = selectedSquare;
      const toSquare = squareNumber;

      const pieceToMove = currentPiecePositions[fromSquare];
      if (
        !pieceToMove ||
        (playersTurn === "W" && !pieceToMove.startsWith("W")) ||
        (playersTurn === "B" && !pieceToMove.startsWith("B"))
      ) {
        Swal.fire({
          icon: "warning",
          title: "Некорректный выбор",
          text: "На этом квадрате нет вашей фигуры.",
        }).then(() => {
          setSelectedSquare(null);
        });
        return;
      }

      const fromCoords = squareNumberToCoords(fromSquare);
      const toCoords = squareNumberToCoords(toSquare);
      if (!fromCoords || !toCoords) {
        setSelectedSquare(null);
        return;
      }

      const rowDiff = Math.abs(fromCoords.row - toCoords.row);
      const colDiff = Math.abs(fromCoords.col - toCoords.col);
      const isKing = pieceToMove.includes("K");

      const rowStep = toCoords.row > fromCoords.row ? 1 : -1;
      const colStep = toCoords.col > fromCoords.col ? 1 : -1;

      if (!isKing) {
        if (rowDiff !== colDiff || rowDiff === 0) {
          Swal.fire({
            icon: "warning",
            title: "Недопустимый ход",
            text: "Обычная шашка может ходить только по диагонали.",
          }).then(() => {
            setSelectedSquare(null);
          });
          return;
        }
        if (rowDiff > 2 || colDiff > 2) {
          Swal.fire({
            icon: "warning",
            title: "Недопустимый ход",
            text: "Обычная шашка может ходить только на одну клетку по диагонали или через одну при взятии.",
          }).then(() => {
            setSelectedSquare(null);
          });
          return;
        }
        if (rowDiff === 2) {
          if (colDiff !== 2) {
            Swal.fire({
              icon: "warning",
              title: "Недопустимый ход",
              text: "Ход возможен только строго по диагонали.",
            }).then(() => {
              setSelectedSquare(null);
            });
            return;
          }
          const captureRow = fromCoords.row + rowStep;
          const captureCol = fromCoords.col + colStep;
          const captureSquare = coordsToSquareNumber(captureRow, captureCol);
          if (
            !(
              captureSquare &&
              currentPiecePositions[captureSquare]?.startsWith(
                playersTurn === "W" ? "B" : "W"
              ) &&
              !currentPiecePositions[toSquare]
            )
          ) {
            Swal.fire({
              icon: "warning",
              title: "Недопустимый ход",
              text: "Перепрыгивать через шашку можно только при взятии.",
            }).then(() => {
              setSelectedSquare(null);
            });
            return;
          }
        }
      }

      const forcedCaptures = findForcedCaptures(
        currentPiecePositions,
        playersTurn
      );

      let move = null;

      if (isKing) {
        let pathClear = true;
        let capturedSquare = null;

        let currentRow = fromCoords.row + rowStep;
        let currentCol = fromCoords.col + colStep;

        while (
          (currentRow !== toCoords.row || currentCol !== toCoords.col) &&
          currentRow >= 0 &&
          currentRow <= 7 &&
          currentCol >= 0 &&
          currentCol <= 7
        ) {
          const checkSquare = coordsToSquareNumber(currentRow, currentCol);

          if (checkSquare && currentPiecePositions[checkSquare]) {
            if (
              currentPiecePositions[checkSquare].startsWith(
                playersTurn === "W" ? "B" : "W"
              )
            ) {
              if (capturedSquare) {
                pathClear = false;
                break;
              }
              capturedSquare = checkSquare;
            } else {
              pathClear = false;
              break;
            }
          }
          currentRow += rowStep;
          currentCol += colStep;
        }

        if (currentRow !== toCoords.row || currentCol !== toCoords.col) {
          pathClear = false;
        }

        if (currentPiecePositions[toSquare]) {
          pathClear = false;
        }

        if (!pathClear) {
          Swal.fire({
            icon: "warning",
            title: "Недопустимый ход",
            text: "Путь заблокирован или конечная точка недостижима.",
          }).then(() => {
            setSelectedSquare(null);
          });
          return;
        }

        if (forcedCaptures.length > 0 && !capturedSquare) {
          Swal.fire({
            icon: "warning",
            title: "Обязательное взятие",
            text: "Есть обязательное взятие шашки противника!",
          }).then(() => {
            setSelectedSquare(null);
          });
          return;
        }

        if (capturedSquare) {
          move = {
            type: "capture",
            from: fromSquare,
            captures: [toSquare],
            captured: [capturedSquare],
          };
        } else {
          move = { type: "move", from: fromSquare, to: toSquare };
        }

        const newPieces = applyMoveToPieces(currentPiecePositions, move);
        setCurrentPiecePositions(newPieces);
        setUserAttemptedMoves((prev) => [...prev, move]);
        setMoveCount((prev) => prev + 1);

        if (checkGameEnd(newPieces, move)) {
          return;
        }

        const newUserMoves = [...userAttemptedMoves, move];
        if (checkCompleteSolution(newUserMoves)) {
          return;
        }

        if (capturedSquare) {
          const nextCaptures = findForcedCaptures(newPieces, playersTurn);
          const hasMoreCaptures = nextCaptures.some((c) => c.from === toSquare);

          if (hasMoreCaptures) {
            setSelectedSquare(toSquare);
            return;
          }
        }

        setSelectedSquare(null);
        setCurrentTurn("B");
        return;
      } else if (rowDiff === 2) {
        const captureRow = fromCoords.row + rowStep;
        const captureCol = fromCoords.col + colStep;
        const captureSquare = coordsToSquareNumber(captureRow, captureCol);

        if (
          captureSquare &&
          currentPiecePositions[captureSquare]?.startsWith(
            playersTurn === "W" ? "B" : "W"
          ) &&
          !currentPiecePositions[toSquare]
        ) {
          move = {
            type: "capture",
            from: fromSquare,
            captures: [toSquare],
            captured: [captureSquare],
          };

          const newPieces = applyMoveToPieces(currentPiecePositions, move);
          setCurrentPiecePositions(newPieces);
          setUserAttemptedMoves((prev) => [...prev, move]);
          setMoveCount((prev) => prev + 1);

          if (checkGameEnd(newPieces, move)) {
            return;
          }

          const newUserMoves = [...userAttemptedMoves, move];
          if (checkCompleteSolution(newUserMoves)) {
            return;
          }

          const nextCaptures = findForcedCaptures(newPieces, playersTurn);
          const hasMoreCaptures = nextCaptures.some((c) => c.from === toSquare);

          if (hasMoreCaptures) {
            setSelectedSquare(toSquare);
          } else {
            setSelectedSquare(null);
            setCurrentTurn(playersTurn === "W" ? "B" : "W");
          }

          if (moveCount % 5 === 0 && moveCount > 0) {
            const currentUserMoves = newUserMoves
              .map(formatMoveToString)
              .join(",");
            const solutionMoves = problem.Solution.split(",");
            const userMoves = currentUserMoves
              .split(",")
              .filter((move) => move.trim() !== "");

            const userCaptures = userMoves.filter((move) => move.includes("x"));
            const solutionCaptures = solutionMoves.filter((move) =>
              move.includes("x")
            );

            if (userCaptures.length === 0) {
              return;
            }

            let isValidPartialSolution = true;
            let solutionIndex = 0;

            for (let i = 0; i < userCaptures.length; i++) {
              const userMove = userCaptures[i];
              const solutionMove = solutionCaptures[solutionIndex];

              if (userMove === solutionMove) {
                solutionIndex++;
              } else {
                const nextSolutionMove = solutionCaptures[solutionIndex + 1];
                if (
                  nextSolutionMove &&
                  nextSolutionMove.startsWith(userMove.split("x")[1])
                ) {
                  solutionIndex++;
                  i--;
                } else {
                  isValidPartialSolution = false;
                  break;
                }
              }
            }

            if (!isValidPartialSolution) {
              Swal.fire({
                icon: "warning",
                title: "Возможно, вы идете неверным путем",
                text: "Хотите начать заново?",
                showCancelButton: true,
                confirmButtonText: "Начать заново",
                cancelButtonText: "Продолжить",
              }).then((result) => {
                if (result.isConfirmed) {
                  handleResetAttempt();
                }
              });
            }
          }
          return;
        }
      } else if (rowDiff === 1) {
        if (!isKing && forcedCaptures.length > 0) {
          Swal.fire({
            icon: "warning",
            title: "Обязательное взятие",
            text: "Есть обязательное взятие шашки противника!",
          }).then(() => {
            setSelectedSquare(null);
          });
          return;
        }

        if (
          !isKing &&
          ((playersTurn === "W" && rowStep > 0) ||
            (playersTurn === "B" && rowStep < 0))
        ) {
          Swal.fire({
            icon: "warning",
            title: "Недопустимый ход",
            text: "Простая шашка может ходить только вперед.",
          }).then(() => {
            setSelectedSquare(null);
          });
          return;
        }
      }

      if (!currentPiecePositions[toSquare]) {
        move = { type: "move", from: fromSquare, to: toSquare };
        const newPieces = applyMoveToPieces(currentPiecePositions, move);
        setCurrentPiecePositions(newPieces);
        setUserAttemptedMoves((prev) => [...prev, move]);
        setMoveCount((prev) => prev + 1);

        if (checkGameEnd(newPieces, move)) {
          return;
        }

        const newUserMoves = [...userAttemptedMoves, move];
        if (checkCompleteSolution(newUserMoves)) {
          return;
        }

        setSelectedSquare(null);
        setCurrentTurn(playersTurn === "W" ? "B" : "W");

        if (moveCount % 3 === 0 && moveCount > 0) {
          const currentUserMoves = newUserMoves
            .map(formatMoveToString)
            .join(",");
          const solutionMoves = problem.Solution.split(",");
          const userMoves = currentUserMoves
            .split(",")
            .filter((move) => move.trim() !== "");

          const userCaptures = userMoves.filter((move) => move.includes("x"));
          const solutionCaptures = solutionMoves.filter((move) =>
            move.includes("x")
          );

          if (userCaptures.length === 0) {
            return;
          }

          let isValidPartialSolution = true;
          let solutionIndex = 0;

          for (let i = 0; i < userCaptures.length; i++) {
            const userMove = userCaptures[i];
            const solutionMove = solutionCaptures[solutionIndex];

            if (userMove === solutionMove) {
              solutionIndex++;
            } else {
              const nextSolutionMove = solutionCaptures[solutionIndex + 1];
              if (
                nextSolutionMove &&
                nextSolutionMove.startsWith(userMove.split("x")[1])
              ) {
                solutionIndex++;
                i--;
              } else {
                isValidPartialSolution = false;
                break;
              }
            }
          }

          if (!isValidPartialSolution) {
            Swal.fire({
              icon: "warning",
              title: "Возможно, вы идете неверным путем",
              text: "Хотите начать заново?",
              showCancelButton: true,
              confirmButtonText: "Начать заново",
              cancelButtonText: "Продолжить",
            }).then((result) => {
              if (result.isConfirmed) {
                handleResetAttempt();
              }
            });
          }
        }
        return;
      }
    } else {
      if (pieceOnSquare) {
        if (pieceOnSquare.startsWith("B")) {
          Swal.fire({
            icon: "warning",
            title: "Недопустимый выбор",
            text: "Вы не можете выбирать черные шашки.",
          });
          return;
        }
        setSelectedSquare(squareNumber);
      } else {
        setSelectedSquare(null);
      }
    }
  };

  const showHint = () => {
    if (problem && problem.Hint) {
      Swal.fire({
        title: "Подсказка",
        text: problem.Hint,
        icon: "info",
      });
    } else {
      Swal.fire({
        title: "Подсказка",
        text: "Подсказка недоступна.",
        icon: "info",
      });
    }
  };

  const showSolution = () => {
    if (problem && problem.Solution) {
      const solutions = problem.Solution.split("|").map((solution) =>
        solution.trim()
      );
      const solutionsText =
        solutions.length > 1
          ? "Возможные решения:\n" +
            solutions.map((sol, index) => `${index + 1}) ${sol}`).join("\n")
          : problem.Solution;

      Swal.fire({
        title: "Решение",
        text: solutionsText,
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Решение",
        text: "Решение недоступно.",
        icon: "info",
      });
    }
  };

  useEffect(() => {
    if (startTime == null && !isProblemSolved && !isGameEnded) {
      setStartTime(Date.now());
      setCurrentTime(0);
    }
  }, [startTime, isProblemSolved, isGameEnded]);

  useEffect(() => {
    let interval;
    if (startTime && !isProblemSolved && !isGameEnded) {
      interval = setInterval(() => {
        setCurrentTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [startTime, isProblemSolved, isGameEnded]);

  useEffect(() => {
    const loadInitialStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`/problems/${problemId}/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProblemStatus(data);
          if (data.isCompleted) {
            setIsProblemSolved(true);
          }
        }
      } catch (error) {
        console.error("Error loading initial status:", error);
      }
    };

    loadInitialStatus();
  }, [problemId]);

  const formatTime = (seconds) => {
    if (seconds == null) return "—";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <ProblemContainer>
        <ProblemTitle>Загрузка задачи...</ProblemTitle>
      </ProblemContainer>
    );
  }

  if (error) {
    return (
      <ProblemContainer>
        <ProblemTitle>{error}</ProblemTitle>
      </ProblemContainer>
    );
  }

  if (!problem || !currentPiecePositions) {
    return (
      <ProblemContainer>
        <ProblemTitle>Задача не найдена или данные некорректны.</ProblemTitle>
      </ProblemContainer>
    );
  }

  const currentUserMoveString =
    userAttemptedMoves.length > 0
      ? userAttemptedMoves.map(formatMoveToString).join(", ")
      : "";

  return (
    <Container>
      <ProblemContainer>
        <DifficultyBadge difficulty={problem.Difficulty}>
          {getDifficultyText(problem.Difficulty)}
        </DifficultyBadge>
        <StatusBadge isCompleted={problemStatus.isCompleted}>
          {problemStatus.isCompleted ? "Решено" : "Не решено"}
        </StatusBadge>
        {problem.Description && (
          <ProblemDescription>{problem.Description}</ProblemDescription>
        )}
        <CheckersBoard
          pieces={currentPiecePositions}
          interactive={!isProblemSolved}
          onSquareClick={handleSquareClick}
          selectedSquare={selectedSquare}
        />
        <UserMoveMessage>
          {currentUserMoveString
            ? `Ваша попытка: ${currentUserMoveString}`
            : "Сделайте свой первый ход"}
        </UserMoveMessage>
        {!isLesson && (
          <>
            <StatsContainer>
              <StatHeader>Статистика решения</StatHeader>
              <StatsGrid>
                <StatCard>
                  <StatValue>{problemStatus.attempts || 0}</StatValue>
                  <StatLabel>Попыток</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{formatTime(problemStatus.bestTime)}</StatValue>
                  <StatLabel>Лучшее время</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{problemStatus.score || 0}</StatValue>
                  <StatLabel>Очков</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{formatTime(currentTime)}</StatValue>
                  <StatLabel>Текущее время</StatLabel>
                </StatCard>
              </StatsGrid>
            </StatsContainer>
          </>
        )}
        <ActionsContainer>
          {problem.Hint && (
            <ActionButton onClick={showHint}>Подсказка</ActionButton>
          )}
          {problem.Solution && (
            <ActionButton onClick={showSolution} disabled={!isProblemSolved}>
              Показать решение
            </ActionButton>
          )}
          <ActionButton
            onClick={handleResetAttempt}
            disabled={userAttemptedMoves.length === 0 && !isProblemSolved}
          >
            Сбросить
          </ActionButton>
        </ActionsContainer>
        {!isLesson && (
          <NavigationContainer>
            <NavigationButton
              onClick={handlePreviousProblem}
              disabled={currentProblemIndex <= 0}
            >
              Предыдущая задача
            </NavigationButton>
            <NavigationButton
              onClick={handleNextProblem}
              disabled={currentProblemIndex >= problems.length - 1}
            >
              Следующая задача
            </NavigationButton>
          </NavigationContainer>
        )}
      </ProblemContainer>
    </Container>
  );
};

export default ProblemViewer;
