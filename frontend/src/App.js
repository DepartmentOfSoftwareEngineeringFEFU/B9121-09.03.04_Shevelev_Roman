import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import Header from "./components/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import TrainingHubPage from "./pages/TrainingHubPage";
import LessonsPage from "./pages/LessonsPage";
import LessonDetailsPage from "./pages/LessonsDetailsPage";
import RulesPage from "./pages/RulesPage";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemCategoryPage from "./pages/ProblemCategoryPage";
import ProblemPage from "./pages/ProblemPage";
import TrainerGame from "./components/interactive/TrainerGame";
import Admin from "./pages/Admin";

const AppContainer = styled.div`
  font-family: "Montserrat", sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const moveChecker = keyframes`
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(8rem, 8rem);
  }
  50% {
    transform: translate(16rem, 0);
  }
  75% {
    transform: translate(8rem, -8rem);
  }
  100% {
    transform: translate(0, 0);
  }
`;

const MainContainer = styled.main`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 10rem);
  padding: 0;
  text-align: center;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #f0f0f0;
    background-image: repeating-conic-gradient(#6c6c6c 0 25%, transparent 0 50%),
      repeating-conic-gradient(#6c6c6c 0 25%, transparent 0 50%);
    background-position: 0 0, 4rem 4rem;
    background-size: 8rem 8rem;
    filter: blur(10px);
    z-index: -2;
  }

  & > * {
    position: relative;
    z-index: 1;
  }
`;

const CheckersContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
`;

const Checker = styled.img`
  position: absolute;
  width: 4rem;
  height: 4rem;
  animation: ${moveChecker} ${({ duration }) => duration}s linear infinite;
  animation-delay: ${({ delay }) => delay}s;
  filter: blur(8px);

  &:nth-child(1) {
    top: 8rem;
    left: 4rem;
  }
  &:nth-child(2) {
    top: 40rem;
    left: 12rem;
  }
  &:nth-child(3) {
    top: 8rem;
    left: 52rem;
  }
  &:nth-child(4) {
    top: 16rem;
    left: 28rem;
  }
  &:nth-child(5) {
    top: 8rem;
    left: 68rem;
  }
  &:nth-child(6) {
    top: 24rem;
    left: 100rem;
  }
  &:nth-child(7) {
    top: 40rem;
    left: 108rem;
  }
  &:nth-child(8) {
    top: 8rem;
    left: 108rem;
  }
  &:nth-child(9) {
    top: 40rem;
    left: 36rem;
  }
  &:nth-child(10) {
    top: 40rem;
    left: 60rem;
  }
`;

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin" element={<Admin />} />
      </Routes>
    );
  }

  return (
    <AppContainer>
      <Header />
      <MainContainer>
        <CheckersContainer>
          <Checker src={"/assets/simple_black.svg"} duration={10} delay={0} />
          <Checker src={"/assets/simple_white.svg"} duration={12} delay={2} />
          <Checker src={"/assets/simple_black.svg"} duration={14} delay={8} />
          <Checker src={"/assets/simple_white.svg"} duration={10} delay={5} />
          <Checker src={"/assets/simple_black.svg"} duration={16} delay={0} />
          <Checker src={"/assets/simple_white.svg"} duration={16} delay={6} />
          <Checker src={"/assets/simple_black.svg"} duration={14} delay={4} />
          <Checker src={"/assets/simple_white.svg"} duration={12} delay={2} />
          <Checker src={"/assets/simple_black.svg"} duration={10} delay={2} />
          <Checker src={"/assets/simple_white.svg"} duration={10} delay={0} />
        </CheckersContainer>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/training" element={
            <PrivateRoute>
              <TrainingHubPage />
            </PrivateRoute>
          } />
          <Route path="/training/lessons" element={
            <PrivateRoute>
              <LessonsPage />
            </PrivateRoute>
          } />
          <Route path="/training/lessons/:id" element={
            <PrivateRoute>
              <LessonDetailsPage />
            </PrivateRoute>
          } />
          <Route path="/training/problems" element={
            <PrivateRoute>
              <ProblemsPage />
            </PrivateRoute>
          } />
          <Route path="/training/problems/category/:id" element={
            <PrivateRoute>
              <ProblemCategoryPage />
            </PrivateRoute>
          } />
          <Route path="/training/problems/:id" element={
            <PrivateRoute>
              <ProblemPage />
            </PrivateRoute>
          } />
          <Route path="/training/trainer" element={
            <PrivateRoute>
              <TrainerGame />
            </PrivateRoute>
          } />
        </Routes>
      </MainContainer>
      <Footer />
    </AppContainer>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
