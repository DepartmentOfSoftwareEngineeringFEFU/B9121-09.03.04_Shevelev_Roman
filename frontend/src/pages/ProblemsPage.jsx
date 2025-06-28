import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";

const ProblemsContainer = styled.div`
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

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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

const CategoryCard = styled(motion.div)`
  background: #fff;
  border-radius: 15px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 180px;
  width: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CategoryTitle = styled.h2`
  color: #8b4513;
  margin-bottom: 0.8rem;
  font-size: 1.3rem;
  text-align: center;
`;

const CategoryDescription = styled.p`
  color: #666;
  margin-bottom: 1rem;
  flex-grow: 1;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const DifficultyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
`;

const DifficultyItem = styled(motion.div)`
  background: #f5f5f5;
  padding: 0.6rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DifficultyLabel = styled.span`
  font-weight: 500;
  font-size: 0.9rem;
  color: ${(props) => {
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

const ProblemCount = styled.span`
  color: #666;
  font-size: 0.8rem;
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

const CompletedBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #4caf50;
  color: #fff;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
`;

const buttonVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const ProblemsPage = () => {
  const [categories, setCategories] = useState([]);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, problemsRes] = await Promise.all([
          fetch("/problems/category/all", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          fetch("/problems", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        if (!categoriesRes.ok || !problemsRes.ok) {
          throw new Error("Ошибка при загрузке данных");
        }

        const categoriesData = await categoriesRes.json();
        const problemsData = await problemsRes.json();

        setCategories(categoriesData);
        setProblems(problemsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProblemsByCategoryAndDifficulty = (categoryId, difficulty) => {
    return problems.filter(
      (problem) =>
        problem.CategoryID === categoryId && problem.Difficulty === difficulty
    );
  };

  const getCompletedProblemsCount = (categoryId, difficulty) => {
    return getProblemsByCategoryAndDifficulty(categoryId, difficulty).filter(
      (problem) => problem.isCompleted
    ).length;
  };

  const getDifficultiesForCategory = (categoryId) => {
    const difficulties = new Set(
      problems
        .filter((problem) => problem.CategoryID === categoryId)
        .map((problem) => problem.Difficulty)
    );
    return Array.from(difficulties).sort((a, b) => {
      const order = { Easy: 1, Medium: 2, Hard: 3 };
      return order[a] - order[b];
    });
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/training/problems/category/${categoryId}`);
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <ProblemsContainer>
      <BackButton
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        onClick={() => navigate("/training")}
      >
        <FiArrowLeft size={20} />
      </BackButton>

      <PageTitle>Задачи</PageTitle>

      <CategoriesGrid>
        {categories.map((category) => {
          const categoryProblems = problems.filter(
            (p) => p.CategoryID === category.ID
          );
          const totalProblems = categoryProblems.length;
          const completedProblems = categoryProblems.filter(
            (p) => p.isCompleted
          ).length;
          const availableDifficulties = getDifficultiesForCategory(category.ID);
          const allCompleted =
            totalProblems > 0 && completedProblems === totalProblems;

          return (
            <CategoryCard
              key={category.ID}
              onClick={() => handleCategoryClick(category.ID)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ position: "relative" }}
            >
              <CategoryTitle>{category.Name}</CategoryTitle>
              <CategoryDescription>{category.Description}</CategoryDescription>
              {allCompleted && (
                <CompletedBadge>
                  <FaCheck />
                </CompletedBadge>
              )}
              <DifficultyList>
                <DifficultyItem>
                  <DifficultyLabel>Всего решено</DifficultyLabel>
                  <ProblemCount>
                    {completedProblems}/{totalProblems}
                  </ProblemCount>
                </DifficultyItem>
                {availableDifficulties.map((difficulty) => {
                  const problemsCount = getProblemsByCategoryAndDifficulty(
                    category.ID,
                    difficulty
                  ).length;
                  if (problemsCount === 0) return null;

                  const completedCount = getCompletedProblemsCount(
                    category.ID,
                    difficulty
                  );
                  return (
                    <DifficultyItem key={difficulty}>
                      <DifficultyLabel difficulty={difficulty}>
                        {difficulty === "Easy"
                          ? "Легкий"
                          : difficulty === "Medium"
                          ? "Средний"
                          : "Сложный"}
                      </DifficultyLabel>
                      <ProblemCount>
                        {completedCount}/{problemsCount}
                      </ProblemCount>
                    </DifficultyItem>
                  );
                })}
              </DifficultyList>
            </CategoryCard>
          );
        })}
      </CategoriesGrid>
    </ProblemsContainer>
  );
};

export default ProblemsPage;
