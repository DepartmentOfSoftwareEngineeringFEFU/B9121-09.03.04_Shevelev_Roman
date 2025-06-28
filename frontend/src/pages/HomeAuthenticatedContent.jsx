import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import StatisticCard from "../components/StatisticCard";
import NavigationCard from "../components/NavigationCard";
import useTrainingProgress from "../hooks/useTrainingProgress";

import {
  faCrown,
  faGamepad,
  faBook,
  faQuestionCircle,
  faDumbbell,
} from "@fortawesome/free-solid-svg-icons";

const CardsGridContainer = styled.div`
  display: grid;
  gap: 24px;
  width: 100%;
  max-width: 960px;
  margin: 20px auto;
  padding: 0 15px;

  grid-template-columns: 1fr;
  grid-template-areas:
    "rating"
    "games"
    "lessons"
    "problems"
    "trainers";

  @media (min-width: 600px) {
    grid-template-columns: repeat(6, 1fr);
    grid-template-areas:
      "rating rating rating games games games"
      "lessons lessons problems problems trainers trainers";
  }

  justify-items: stretch;
  align-items: stretch;
`;

const RatingCard = styled(StatisticCard)``;

const HomeAuthenticatedContent = ({ userData }) => {
  const progress = useTrainingProgress();

  if (!userData) {
    return <div>Загрузка данных профиля...</div>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ width: "100%", display: "flex", justifyContent: "center" }}
    >
      <CardsGridContainer>
        <motion.div variants={itemVariants} style={{ gridArea: "rating" }}>
          <RatingCard label="Рейтинг" value={userData.Rating} icon={faCrown} />
        </motion.div>

        <motion.div variants={itemVariants} style={{ gridArea: "games" }}>
          <StatisticCard
            label="Сыграно игр"
            value={userData.GamesPlayed}
            icon={faGamepad}
          />
        </motion.div>
        <motion.div variants={itemVariants} style={{ gridArea: "lessons" }}>
          <NavigationCard
            label="Уроки"
            to="/training/lessons"
            icon={faBook}
            progress={progress.lessons}
          />
        </motion.div>
        <motion.div variants={itemVariants} style={{ gridArea: "problems" }}>
          <NavigationCard
            label="Задачи"
            to="/training/problems"
            icon={faQuestionCircle}
            progress={progress.problems}
          />
        </motion.div>
        <motion.div variants={itemVariants} style={{ gridArea: "trainers" }}>
          <NavigationCard
            label="Тренажер"
            to="/training/trainer"
            icon={faDumbbell}
            progress={progress.trainers}
          />
        </motion.div>
      </CardsGridContainer>
    </motion.div>
  );
};

export default HomeAuthenticatedContent;
