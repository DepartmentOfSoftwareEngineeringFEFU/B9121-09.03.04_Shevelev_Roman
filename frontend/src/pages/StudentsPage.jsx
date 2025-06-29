import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUsers, FiBook, FiTarget } from "react-icons/fi";
import AuthContext from "../context/AuthContext";
import Swal from "sweetalert2";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #8b4513 0%, #a0522d 100%);
  padding: 20px;
  color: #f5f5dc;
`;

const BackButton = styled(motion.button)`
  position: fixed;
  top: 100px;
  left: 20px;
  background: rgba(187, 184, 10, 1);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffd700;
  cursor: pointer;
  backdrop-filter: blur(10px);
  z-index: 1000;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
`;

const PageTitle = styled.h1`
  text-align: center;
  color: #ffd700;
  font-size: 2.5rem;
  margin: 20px 0 40px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const StudentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
`;

const StudentCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  }
`;

const StudentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(255, 215, 0, 0.3);
`;

const StudentInfo = styled.div`
  flex: 1;
`;

const StudentName = styled.h3`
  color: #ffd700;
  font-size: 1.4rem;
  margin: 0 0 4px 0;
`;

const StudentEmail = styled.p`
  color: #fffbe6;
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.8;
`;

const GroupBadge = styled.span`
  background: rgba(255, 215, 0, 0.2);
  color: #ffd700;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid rgba(255, 215, 0, 0.3);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #fffbe6;
  opacity: 0.8;
`;

const ProgressSection = styled.div`
  margin-bottom: 20px;
`;

const ProgressTitle = styled.h4`
  color: #ffd700;
  font-size: 1.1rem;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #ffd700, #ffed4e);
  border-radius: 4px;
  transition: width 0.3s ease;
  width: ${props => props.percentage}%;
`;

const ProgressText = styled.div`
  font-size: 0.9rem;
  color: #fffbe6;
  text-align: center;
`;

const DetailsButton = styled.button`
  background: rgba(255, 215, 0, 0.2);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    background: rgba(255, 215, 0, 0.3);
    transform: translateY(-2px);
  }
`;

const GameStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
`;

const GameStat = styled.div`
  text-align: center;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

const GameStatValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => {
    if (props.type === 'wins') return '#4caf50';
    if (props.type === 'losses') return '#f44336';
    return '#ffd700';
  }};
`;

const GameStatLabel = styled.div`
  font-size: 0.8rem;
  color: #fffbe6;
  opacity: 0.8;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.2rem;
  color: #ffd700;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #fffbe6;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  color: #ffd700;
  margin-bottom: 20px;
  opacity: 0.5;
`;

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const StudentsPage = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchStudents();
  }, [userData, navigate]);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/users/trainer/students", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        console.error("Ошибка при получении данных учеников");
        Swal.fire({
          icon: "error",
          title: "Ошибка",
          text: "Не удалось загрузить данные учеников"
        });
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      Swal.fire({
        icon: "error",
        title: "Ошибка сети",
        text: "Не удалось подключиться к серверу"
      });
    } finally {
      setLoading(false);
    }
  };

  const showStudentDetails = (student) => {
    Swal.fire({
      title: `Детальная статистика: ${student.Nickname}`,
      html: `
        <div style="text-align: left; max-height: 400px; overflow-y: auto;">
          <h4 style="color: #ffd700; margin-bottom: 15px;">Статистика по задачам:</h4>
          ${student.problemStats.map(stat => `
            <div style="margin-bottom: 10px; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 6px;">
              <strong style="color: #ffd700;">${stat.CategoryName}</strong><br>
              Решено: ${stat.CompletedProblems}/${stat.TotalProblems}<br>
              Среднее время: ${stat.AvgBestTime ? Math.round(stat.AvgBestTime) + ' сек' : '—'}<br>
              Средний балл: ${stat.AvgScore ? Math.round(stat.AvgScore) : '—'}
            </div>
          `).join('')}
          
          <h4 style="color: #ffd700; margin: 20px 0 15px 0;">Изученные уроки:</h4>
          ${student.lessonStats.map(lesson => `
            <div style="margin-bottom: 8px; padding: 6px; background: rgba(255,255,255,0.1); border-radius: 4px;">
              <span style="color: ${lesson.isCompleted ? '#4caf50' : '#f44336'};">${lesson.isCompleted ? '✓' : '✗'}</span>
              <strong>${lesson.Title}</strong> (${lesson.Topic}, ${lesson.Difficulty})
            </div>
          `).join('')}
        </div>
      `,
      width: '600px',
      confirmButtonText: 'Закрыть',
      confirmButtonColor: '#ffd700'
    });
  };

  if (loading) {
    return (
      <Container>
        <BackButton
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          onClick={() => navigate("/profile")}
        >
          <FiArrowLeft size={20} />
        </BackButton>
        <LoadingContainer>Загрузка данных учеников...</LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        onClick={() => navigate("/profile")}
      >
        <FiArrowLeft size={20} />
      </BackButton>

      <PageTitle>Мои ученики</PageTitle>

      {students.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <FiUsers size={80} />
          </EmptyIcon>
          <h3>У вас пока нет учеников</h3>
          <p>Создайте группу и пригласите пользователей, чтобы увидеть их статистику здесь</p>
        </EmptyState>
      ) : (
        <StudentsGrid>
          {students.map((student, index) => (
            <StudentCard
              key={student.ID}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              <StudentHeader>
                <StudentInfo>
                  <StudentName>{student.Nickname}</StudentName>
                  <StudentEmail>{student.Email}</StudentEmail>
                </StudentInfo>
                <GroupBadge>{student.GroupName}</GroupBadge>
              </StudentHeader>

              <GameStats>
                <GameStat>
                  <GameStatValue type="wins">{student.Wins}</GameStatValue>
                  <GameStatLabel>Побед</GameStatLabel>
                </GameStat>
                <GameStat>
                  <GameStatValue type="losses">{student.Losses}</GameStatValue>
                  <GameStatLabel>Поражений</GameStatLabel>
                </GameStat>
                <GameStat>
                  <GameStatValue type="draws">{student.Draws}</GameStatValue>
                  <GameStatLabel>Ничьих</GameStatLabel>
                </GameStat>
              </GameStats>

              <StatsGrid>
                <StatCard>
                  <StatValue>{student.Rating}</StatValue>
                  <StatLabel>Рейтинг</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{student.GamesPlayed}</StatValue>
                  <StatLabel>Игр сыграно</StatLabel>
                </StatCard>
              </StatsGrid>

              <ProgressSection>
                <ProgressTitle>
                  <FiTarget />
                  Задачи
                </ProgressTitle>
                <ProgressBar>
                  <ProgressFill percentage={student.problems.percentage} />
                </ProgressBar>
                <ProgressText>
                  {student.problems.completed} / {student.problems.total} ({student.problems.percentage}%)
                </ProgressText>
              </ProgressSection>

              <ProgressSection>
                <ProgressTitle>
                  <FiBook />
                  Уроки
                </ProgressTitle>
                <ProgressBar>
                  <ProgressFill percentage={student.lessons.percentage} />
                </ProgressBar>
                <ProgressText>
                  {student.lessons.completed} / {student.lessons.total} ({student.lessons.percentage}%)
                </ProgressText>
              </ProgressSection>

              <DetailsButton onClick={() => showStudentDetails(student)}>
                Подробная статистика
              </DetailsButton>
            </StudentCard>
          ))}
        </StudentsGrid>
      )}
    </Container>
  );
};

export default StudentsPage; 