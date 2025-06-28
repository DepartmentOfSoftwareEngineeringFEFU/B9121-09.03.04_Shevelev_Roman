import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaCheck } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import AuthContext from "../context/AuthContext";

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

const LessonsContainer = styled(motion.div)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 15px;
  background-color: #f5f5dc;
  color: #111111;
  position: relative;
  min-width: 1000px;
  margin: 1vmax 0;
  border-radius: 1vmax;
  position: relative;
  min-width: 1000px;
  margin: 2vmax 0;
  border-radius: 1vmax;
`;

const PageTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  color: #8b4513;
  margin-bottom: 30px;
  text-align: center;
`;

const LessonsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  max-width: 800px;
  position: relative;
`;

const LessonItem = styled(motion.li)`
  background-color: rgba(160, 82, 45, 0.9);
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 20px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;
  position: relative;
`;

const CompletedBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ffd700;
  color: #8b4513;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
`;

const LessonLink = styled(Link)`
  text-decoration: none;
  color: #f5f5dc;
  display: block;
`;

const LessonTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0 10px 0;
  color: #ffd700;
`;

const LessonDescription = styled.p`
  font-size: 1rem;
  margin: 0 0 10px 0;
  color: #f5f5dc;
`;

const LessonMeta = styled.div`
  font-size: 0.9rem;
  color: #d2b48c;
`;

const LessonsPage = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch("/training/lessons", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const data = await response.json();

        setLessons(data);
      } catch (err) {
        console.error("Ошибка при загрузке уроков:", err);
        setError("Не удалось загрузить уроки. Пожалуйста, попробуйте позже.");
        Swal.fire({
          icon: "error",
          title: "Ошибка загрузки",
          text: "Не удалось загрузить список уроков.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
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

  if (loading) {
    return (
      <LessonsContainer>
        <PageTitle>Загрузка уроков...</PageTitle>
      </LessonsContainer>
    );
  }

  if (error) {
    return (
      <LessonsContainer>
        <PageTitle>{error}</PageTitle>
      </LessonsContainer>
    );
  }

  return (
    <LessonsContainer
      variants={listVariants}
      initial="hidden"
      animate="visible"
    >
      <BackButton
        to="/training"
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        title="Вернуться к списку обучения"
      >
        <FiArrowLeft />
      </BackButton>
      <PageTitle>Список уроков</PageTitle>
      <LessonsList>
        {lessons.length > 0 ? (
          lessons.map((lesson) => (
            <LessonItem
              key={lesson.ID}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <LessonLink to={`/training/lessons/${lesson.ID}`}>
                <LessonTitle>{lesson.Title}</LessonTitle>
                <LessonDescription>{lesson.Description}</LessonDescription>
                <LessonMeta>
                  Тема: {lesson.Topic} | Сложность: {lesson.Difficulty}
                </LessonMeta>
              </LessonLink>
              {isLoggedIn && lesson.isCompleted && (
                <CompletedBadge>
                  <FaCheck />
                </CompletedBadge>
              )}
            </LessonItem>
          ))
        ) : (
          <p>Уроки не найдены.</p>
        )}
      </LessonsList>
    </LessonsContainer>
  );
};

export default LessonsPage;
