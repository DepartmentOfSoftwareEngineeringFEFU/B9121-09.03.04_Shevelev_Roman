import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import Swal from "sweetalert2";
import AuthContext from "../context/AuthContext";
import { FiArrowLeft } from "react-icons/fi";

import ProblemViewer from "../components/interactive/ProblemViewer";
import BoardViewer from "../components/interactive/BoardViewer";
import AnimatedGame from "../components/interactive/AnimatedGame";

const LessonDetailContainer = styled(motion.div)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 15px;
  background-color: #f5f5dc;
  color: #111111;
  height: calc(100vh - 10rem);
  overflow-y: auto;
  overflow-x: hidden;
  min-width: 1000px;
  margin: 1vmax 0;
  border-radius: 1vmax;
  position: relative;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    margin: 10px 0;
  }

  &::-webkit-scrollbar-thumb {
    background: #8b4513;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a0522d;
  }
`;

const PageTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  color: #8b4513;
  margin-bottom: 20px;
  text-align: center;
  min-width: 1000px;
`;

const LessonContentArea = styled.div`
  background-color: rgba(160, 82, 45, 0.9);
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  width: 100%;
  min-width: 600px;
  max-width: 800px;
  text-align: left;
  color: #f5f5dc;
`;

const BackButton = styled(motion(Link))`
  position: sticky;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #8b4513;
  color: #f5f5dc;
  top: 10px;
  left: 10px;
  align-self: first baseline;
  border-radius: 50%;
  text-decoration: none;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  transition: background-color 0.2s ease-in-out;
  z-index: 1000;
  padding: 10px;

  &:hover {
    background-color: #a0522d;
  }

  & svg {
    font-size: 2rem;
  }
`;

const LessonTopic = styled.p`
  font-size: 1.2rem;
  font-weight: 500;
  color: #ffd700;
  margin: 0 0 15px 0;
`;

const LessonDescription = styled.p`
  font-size: 1rem;
  margin: 0 0 20px 0;
  line-height: 1.6;
`;

const LessonMaterialArea = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  white-space: pre-wrap;

  p {
    margin-bottom: 15px;
    color: inherit;
  }
`;

const CompleteButton = styled.button`
  background-color: #ffd700;
  color: #8b4513;
  border: none;
  padding: 12px 25px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  margin-top: 30px;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #a0522d;
    color: #f5f5dc;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const parseLessonMaterial = (materialText, keyPrefix = "material-") => {
  if (!materialText) return [];

  const tagRegex = /\[(PROBLEM|BOARD|MOVES)\s+([^\]]+)\]/g;
  let lastIndex = 0;
  const elements = [];
  let match;
  let elementKey = 0;

  while ((match = tagRegex.exec(materialText)) !== null) {
    if (match.index > lastIndex) {
      const text = materialText.substring(lastIndex, match.index).trim();
      if (text) {
        const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim() !== "");
        for (const p of paragraphs) {
          elements.push(<p key={`${keyPrefix}${elementKey++}`}>{p}</p>);
        }
      }
    }

    const tagName = match[1];
    const tagContent = match[2];

    const params = {};
    const paramRegex = /(\w+)=(?:(['"])(.*?)\2|(\w+))/g;
    let paramMatch;
    while ((paramMatch = paramRegex.exec(tagContent)) !== null) {
      params[paramMatch[1]] = paramMatch[3] || paramMatch[4];
    }

    switch (tagName) {
      case "PROBLEM":
        if (params.ID) {
          elements.push(
            <ProblemViewer
              key={`${keyPrefix}${elementKey++}`}
              problemId={parseInt(params.ID, 10)}
              isLesson={true}
            />
          );
        } else {
          console.warn(`Тег PROBLEM найден без ID: ${match[0]}`);
          elements.push(
            <p key={`${keyPrefix}${elementKey++}`} style={{ color: "red" }}>
              [Ошибка: Тег PROBLEM требует ID]
            </p>
          );
        }
        break;
      case "BOARD":
        if (params.FEN) {
          elements.push(
            <BoardViewer key={`${keyPrefix}${elementKey++}`} fen={params.FEN} />
          );
        } else {
          console.warn(`Тег BOARD найден без FEN: ${match[0]}`);
          elements.push(
            <p key={`${keyPrefix}${elementKey++}`} style={{ color: "red" }}>
              [Ошибка: Тег BOARD требует FEN]
            </p>
          );
        }
        break;
      case "MOVES":
        if (params.FEN && params.MOVES) {
          elements.push(
            <AnimatedGame
              key={`${keyPrefix}${elementKey++}`}
              fen={params.FEN}
              moves={params.MOVES}
            />
          );
        } else {
          console.warn(`Тег MOVES найден без FEN или MOVES: ${match[0]}`);
          elements.push(
            <p key={`${keyPrefix}${elementKey++}`} style={{ color: "red" }}>
              [Ошибка: Тег MOVES требует FEN и MOVES]
            </p>
          );
        }
        break;
      default:
        console.warn(`Неизвестный тег: ${tagName}`);
        elements.push(
          <p key={`${keyPrefix}${elementKey++}`} style={{ color: "red" }}>
            [Ошибка: Неизвестный тег]
          </p>
        );
    }

    lastIndex = tagRegex.lastIndex;
  }

  if (lastIndex < materialText.length) {
    const text = materialText.substring(lastIndex).trim();
    if (text) {
      const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim() !== "");
      for (const p of paragraphs) {
        elements.push(<p key={`${keyPrefix}${elementKey++}`}>{p}</p>);
      }
    }
  }

  return elements;
};

const LessonDetailsPage = () => {
  const { id } = useParams();
  const { isLoggedIn } = useContext(AuthContext);
  const [lesson, setLesson] = useState(null);
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await fetch(`/training/lessons/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const data = await response.json();
        setLesson(data);
        setIsLessonCompleted(data.isCompleted || false);
      } catch (err) {
        console.error(`Ошибка при загрузке урока с ID ${id}:`, err);
        setError(
          "Не удалось загрузить урок. Пожалуйста, проверьте ID или попробуйте позже."
        );
        Swal.fire({
          icon: "error",
          title: "Ошибка загрузки",
          text: "Не удалось загрузить содержимое урока.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  const handleCompleteLesson = async () => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: "warning",
        title: "Необходимо авторизоваться",
        text: "Пожалуйста, войдите или зарегистрируйтесь, чтобы отмечать уроки как пройденные.",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Не авторизован",
        text: "Не удалось найти токен авторизации.",
      });
      return;
    }

    try {
      const response = await fetch(`/training/lessons/${id}/complete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setIsLessonCompleted(true);

        setLesson({ ...lesson, isCompleted: result.isCompleted });
        Swal.fire({
          icon: "success",
          title: "Успешно!",
          text: result.message || "Урок отмечен как пройденный!",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Ошибка",
          text: result.message || "Не удалось отметить урок как пройденный.",
        });
      }
    } catch (err) {
      console.error("Ошибка при выполнении запроса на завершение урока:", err);
      Swal.fire({
        icon: "error",
        title: "Ошибка сети",
        text: "Произошла ошибка при попытке отметить урок как пройденный. Пожалуйста, попробуйте позже.",
      });
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    hover: { scale: 1.1 },
  };

  const pageVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  if (loading) {
    return (
      <LessonDetailContainer>
        <PageTitle>Загрузка урока...</PageTitle>
      </LessonDetailContainer>
    );
  }

  if (error) {
    return (
      <LessonDetailContainer>
        <PageTitle>{error}</PageTitle>
      </LessonDetailContainer>
    );
  }

  if (!lesson) {
    return (
      <LessonDetailContainer>
        <PageTitle>Урок не найден.</PageTitle>
      </LessonDetailContainer>
    );
  }

  const parsedMaterial = parseLessonMaterial(lesson.Material);

  return (
    <LessonDetailContainer
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <BackButton
        to="/training/lessons"
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        title="Вернуться к списку уроков"
      >
        <FiArrowLeft />
      </BackButton>
      <PageTitle>{lesson.Title}</PageTitle>
      <LessonContentArea>
        <LessonTopic>
          Тема: {lesson.Topic} | Сложность: {lesson.Difficulty}
        </LessonTopic>
        <LessonDescription>{lesson.Description}</LessonDescription>

        <LessonMaterialArea>
          {parsedMaterial.map((element, index) =>
            React.cloneElement(element, { key: element.key || index })
          )}
        </LessonMaterialArea>

        {isLoggedIn && !isLessonCompleted && (
          <CompleteButton onClick={handleCompleteLesson}>
            Завершить урок
          </CompleteButton>
        )}
        {isLoggedIn && isLessonCompleted && (
          <CompleteButton disabled>Урок пройден</CompleteButton>
        )}
      </LessonContentArea>
    </LessonDetailContainer>
  );
};

export default LessonDetailsPage;
