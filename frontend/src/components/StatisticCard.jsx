import React from "react";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StyledCard = styled.div`
  background-color: rgba(160, 82, 45, 0.95);
  color: #f5f5dc;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;

  align-items: center;
  text-align: center;
  min-height: 120px;
  padding: 20px;
  box-sizing: border-box;
  width: 100%;

  justify-content: space-around;
`;

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  width: 100%;
`;

const IconStyled = styled(FontAwesomeIcon)`
  font-size: 1.5rem;
  color: #ffd700;
  margin-right: 8px;
`;

const StatisticLabelText = styled.p`
  font-size: 1.2rem;
  font-weight: 500;
  color: #f5f5dc;
  margin: 0;
  font-family: "Montserrat", sans-serif;
`;

const StatisticValue = styled.p`
  font-size: 2.5rem;
  font-weight: bold;
  color: #ffd700;
  margin: 0;
  font-family: "Montserrat", sans-serif;
`;

const StatisticCard = ({ label, value, icon }) => {
  return (
    <StyledCard>
      <LabelContainer>
        {icon && <IconStyled icon={icon} />}
        <StatisticLabelText>{label}</StatisticLabelText>
      </LabelContainer>
      <StatisticValue>{value}</StatisticValue>
    </StyledCard>
  );
};

export default StatisticCard;
