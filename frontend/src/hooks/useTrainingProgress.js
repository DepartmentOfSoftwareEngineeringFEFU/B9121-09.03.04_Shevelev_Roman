import { useState, useEffect } from "react";

const useTrainingProgress = () => {
  const [progress, setProgress] = useState({
    lessons: { completed: 0, total: 0 },
    problems: { completed: 0, total: 0 },
    trainers: { completed: 0, total: 0 },
  });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const lessonsRes = await fetch("/training/lessons", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        let lessons = [];
        if (lessonsRes.ok) {
          lessons = await lessonsRes.json();
        }

        const problemsRes = await fetch("/problems", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        let problems = [];
        if (problemsRes.ok) {
          problems = await problemsRes.json();
        }

        const completedLessons = lessons.filter(
          (lesson) => lesson.isCompleted
        ).length;
        const completedProblems = problems.filter(
          (problem) => problem.isCompleted
        ).length;

        setProgress({
          lessons: {
            completed: completedLessons,
            total: lessons.length,
          },
          problems: {
            completed: completedProblems,
            total: problems.length,
          },
          trainers: { completed: 0, total: 0 },
        });
      } catch (error) {
        console.error("Ошибка при получении прогресса:", error);
      }
    };

    fetchProgress();
  }, []);

  return progress;
};

export default useTrainingProgress;
