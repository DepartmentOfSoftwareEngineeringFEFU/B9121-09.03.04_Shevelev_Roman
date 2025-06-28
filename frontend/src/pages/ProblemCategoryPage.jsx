import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const CategoryContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PageTitle = styled.h1`
  color: #8b4513;
  text-align: center;
  margin-bottom: 2rem;
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

const ProblemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
  margin-top: 2rem;
  width: 100%;
  max-width: 1200px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem;
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ProblemCard = styled(motion.div)`
  background: #fff;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 180px;
  width: 80%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ProblemTitle = styled.h2`
  color: #8b4513;
  margin-bottom: 0.8rem;
  font-size: 1.3rem;
  text-align: center;
`;

const ProblemDescription = styled.p`
  color: #666;
  margin-bottom: 1rem;
  flex-grow: 1;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const ProblemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: auto;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DifficultyBadge = styled.span`
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  color: white;
  background-color: ${(props) => {
    switch (props.difficulty) {
      case "Easy":
        return "#4CAF50";
      case "Medium":
        return "#FFA500";
      case "Hard":
        return "#F44336";
      default:
        return "#666";
    }
  }};
`;

const ProgressBadge = styled.span`
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  color: white;
  background-color: ${(props) => (props.completed ? "#4CAF50" : "#666")};
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

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-top: 0.8rem;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${(props) =>
    props.highlight ? "rgba(139, 69, 19, 0.1)" : "#f5f5f5"};
  padding: 0.5rem;
  border-radius: 6px;

  span {
    font-size: 0.7rem;
    color: #666;
    margin-bottom: 0.2rem;
  }

  strong {
    font-size: 0.9rem;
    color: #8b4513;
  }
`;

const LastAttemptInfo = styled.div`
  font-size: 0.7rem;
  color: #666;
  margin-top: 0.5rem;
  text-align: center;
  font-style: italic;
`;

const buttonVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const ProblemCategoryPage = () => {
  const { id } = useParams();
  const [problems, setProblems] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [categoryRes, problemsRes] = await Promise.all([
          fetch(`/training/problems/category/${id}`, { headers }),
          fetch(`/training/problems/category/${id}/problems`, { headers }),
        ]);

        if (!categoryRes.ok || !problemsRes.ok) {
          throw new Error("Ошибка при загрузке данных");
        }

        const categoryData = await categoryRes.json();
        const problemsData = await problemsRes.json();

        setCategory(categoryData);
        setProblems(problemsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleProblemClick = (problemId) => {
    navigate(`/training/problems/${problemId}`);
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!category) {
    return <div>Категория не найдена</div>;
  }

  return (
    <CategoryContainer>
      <BackButton
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        onClick={() => navigate("/training/problems")}
      >
        <FiArrowLeft size={20} />
      </BackButton>

      <PageTitle>{category.Name}</PageTitle>

      <ProblemsGrid>
        {problems.map((problem) => (
          <ProblemCard
            key={problem.ID}
            onClick={() => handleProblemClick(problem.ID)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ProblemTitle>{problem.Title}</ProblemTitle>
            <ProblemDescription>{problem.Description}</ProblemDescription>

            <ProblemInfo>
              <InfoRow>
                <DifficultyBadge difficulty={problem.Difficulty}>
                  {problem.Difficulty === "Easy"
                    ? "Легкий"
                    : problem.Difficulty === "Medium"
                    ? "Средний"
                    : "Сложный"}
                </DifficultyBadge>
                <ProgressBadge completed={problem.isCompleted}>
                  {problem.isCompleted ? "Решено" : "Не решено"}
                </ProgressBadge>
              </InfoRow>

              <StatGrid>
                <StatItem>
                  <span>Попыток</span>
                  <strong>{problem.Attempts || 0}</strong>
                </StatItem>
                <StatItem highlight={problem.isCompleted}>
                  <span>Лучшее время</span>
                  <strong>
                    {problem.BestTime
                      ? `${Math.floor(problem.BestTime / 60)}:${(
                          problem.BestTime % 60
                        )
                          .toString()
                          .padStart(2, "0")}`
                      : "—"}
                  </strong>
                </StatItem>
                <StatItem highlight={problem.isCompleted}>
                  <span>Очки</span>
                  <strong>{problem.Score || 0}</strong>
                </StatItem>
                <StatItem>
                  <span>Сложность</span>
                  <strong>
                    {problem.Difficulty === "Easy"
                      ? "★"
                      : problem.Difficulty === "Medium"
                      ? "★★"
                      : "★★★"}
                  </strong>
                </StatItem>
              </StatGrid>

              {problem.LastAttempt !== null ? (
                <LastAttemptInfo>
                  Последняя попытка:{" "}
                  {new Date(problem.LastAttempt).toLocaleString("ru-RU")}
                </LastAttemptInfo>
              ) : (
                <LastAttemptInfo>Эту задачу ещё не решали</LastAttemptInfo>
              )}
            </ProblemInfo>
          </ProblemCard>
        ))}
      </ProblemsGrid>
    </CategoryContainer>
  );
};

export default ProblemCategoryPage;
