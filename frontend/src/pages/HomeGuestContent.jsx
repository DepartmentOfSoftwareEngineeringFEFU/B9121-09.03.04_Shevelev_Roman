import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";

const TextContent = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 30px;
  background-color: rgba(139, 69, 19, 0.85);
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
  color: #f5f5dc;
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: bold;
  color: #f5f5dc;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const Subtitle = styled(motion.p)`
  font-size: 1.4rem;
  font-weight: 500;
  color: #f5f5dc;
  text-align: center;
  max-width: 800px;
`;

const ButtonContainer = styled(motion.div)`
  display: flex;
  gap: 30px;
  margin-top: 20px;
`;

const StyledButton = styled(Link)`
  background-color: #a0522d;
  padding: 20px 40px;
  margin: 12px;
  display: inline-block;
  overflow: hidden;
  color: #ffffff;
  font-size: 20px;
  font-family: "Montserrat", sans-serif;
  letter-spacing: 2.5px;
  text-align: center;
  text-transform: uppercase;
  text-decoration: none;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  position: relative;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ffd700;
    color: #8d3d05;
    box-shadow: 0 25px 55px rgba(0, 0, 0, 0.5);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -130%;
    width: 230%;
    height: 100%;
    background: linear-gradient(to right, transparent, #ffd700, transparent);
    transition: left 0.3s ease;
  }

  &:hover::before {
    left: 0;
  }

  span {
    display: none;
  }
`;

const HomeGuestContent = ({
  handleAuthClick,
  titleVariants,
  subtitleVariants,
  buttonVariants,
}) => {
  return (
    <TextContent>
      <Title variants={titleVariants} initial="hidden" animate="visible">
        Шашечный тренажер
      </Title>
      <Subtitle variants={subtitleVariants} initial="hidden" animate="visible">
        Улучшите свои навыки игры в шашки с помощью интерактивных уроков, задач
        и тренажеров. Станьте мастером игры, тренируясь в любое время и в любом
        месте.
      </Subtitle>
      <ButtonContainer
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
      >
        <StyledButton onClick={handleAuthClick}>Начать Обучение</StyledButton>
      </ButtonContainer>
    </TextContent>
  );
};

export default HomeGuestContent;
