import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import NavigationCard from "../components/NavigationCard";
import useTrainingProgress from "../hooks/useTrainingProgress";

import {
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

  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

  justify-items: stretch;
  align-items: stretch;
`;

const TrainingHubPage = () => {
  const progress = useTrainingProgress();

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
        <motion.div variants={itemVariants}>
          <NavigationCard
            label="Уроки"
            to="/training/lessons"
            icon={faBook}
            progress={progress.lessons}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <NavigationCard
            label="Задачи"
            to="/training/problems"
            icon={faQuestionCircle}
            progress={progress.problems}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
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

export default TrainingHubPage;
