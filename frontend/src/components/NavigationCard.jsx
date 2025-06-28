import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaCheck, FaFire } from "react-icons/fa";

const Card = styled(Link)`
  background-color: rgba(160, 82, 45, 0.9);
  border-radius: 8px;
  padding: 20px;
  text-decoration: none;
  color: #f5f5dc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  text-align: center;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const IconWrapper = styled.div`
  font-size: 2.5rem;
  color: #ffd700;
  margin-bottom: 15px;
`;

const Label = styled.h3`
  font-size: 1.5rem;
  margin: 0;
  color: #ffd700;
`;

const ProgressBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${(props) => (props.$isComplete ? "#4CAF50" : "#ffd700")};
  color: ${(props) => (props.$isComplete ? "#ffffff" : "#8b4513")};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const NavigationCard = ({ label, to, icon, progress }) => {
  const showProgress = progress && progress.total > 0;
  const isComplete = showProgress && progress.completed === progress.total;

  return (
    <Card to={to}>
      <IconWrapper>
        <FontAwesomeIcon icon={icon} />
      </IconWrapper>
      <Label>{label}</Label>
      {label === "Тренажер" && (
        <ProgressBadge
          $isComplete={false}
          style={{ backgroundColor: "#ff5722", color: "#fff" }}
        >
          <FaFire />
        </ProgressBadge>
      )}
      {showProgress && (
        <ProgressBadge $isComplete={isComplete}>
          {isComplete ? <FaCheck /> : `${progress.completed}/${progress.total}`}
        </ProgressBadge>
      )}
    </Card>
  );
};

export default NavigationCard;
