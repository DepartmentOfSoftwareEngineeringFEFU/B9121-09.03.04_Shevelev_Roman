import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #333;
  color: white;
  padding: 0 20px;
  height: 5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
`;

const FooterLeft = styled.div`
  text-align: left;
`;

const FooterRight = styled.div`
  text-align: right;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterLeft>Шашечный тренажер</FooterLeft>
      <FooterRight>© Все права защищены. 2025</FooterRight>
    </FooterContainer>
  );
};

export default Footer;