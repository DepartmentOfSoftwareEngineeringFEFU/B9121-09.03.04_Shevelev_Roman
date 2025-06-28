import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import ProblemViewer from "../components/interactive/ProblemViewer";

const ProblemContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PageTitle = styled.h1`
  color: #8b4513;
  text-align: center;
  font-size: 2.5rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 1rem 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  max-width: 80%;
  width: fit-content;
`;

const ProblemContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BoardSection = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 400px;
  min-height: 400px;
`;

const BackButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  left: 20px;
  background: #8b4513;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: #a0522d;
    transform: scale(1.1);
  }
`;

const buttonVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const ProblemPage = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await fetch(`/problems/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Ошибка при загрузке задачи");
        }

        const data = await response.json();
        setProblem(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching problem:", error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!problem) {
    return <div>Задача не найдена</div>;
  }

  return (
    <ProblemContainer>
      <BackButton
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        onClick={() =>
          navigate(`/training/problems/category/${problem.CategoryID}`)
        }
      >
        <FiArrowLeft size={20} />
      </BackButton>

      <PageTitle>{problem.Title}</PageTitle>

      <ProblemContent>
        <BoardSection>
          <ProblemViewer problemId={id} />
        </BoardSection>
      </ProblemContent>
    </ProblemContainer>
  );
};

export default ProblemPage;
