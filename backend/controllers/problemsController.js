const db = require("../config/db");

const getProblems = async (req, res) => {
  try {
    const userId = req.user.ID || req.user.id;

    const [problems] = await db.query(
      `
      SELECT 
        p.ID,
        p.Title,
        p.Description,
        p.CategoryID,
        p.InitialPosition,
        p.Difficulty,
        p.Solution,
        p.Hint,
        p.HintType,
        p.TimeLimit,
        p.Points,
        pc.Name as CategoryName,
        pc.Description as CategoryDescription,
        CASE 
          WHEN up.Completed = 1 THEN true 
          ELSE false 
        END as isCompleted,
        up.Attempts,
        up.BestTime,
        up.Score
      FROM problems p
      INNER JOIN problem_categories pc ON p.CategoryID = pc.ID
      LEFT JOIN user_problems up ON p.ID = up.ProblemID AND up.UserID = ?
      ORDER BY p.CategoryID, p.Difficulty
    `,
      [userId]
    );

    const formattedProblems = problems.map((problem) => ({
      ...problem,
      isCompleted: Boolean(problem.isCompleted),
      Attempts: problem.Attempts || 0,
      BestTime: problem.BestTime || null,
      Score: problem.Score || 0,
    }));

    res.json(formattedProblems);
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({ message: "Ошибка при получении задач" });
  }
};

const getProblemById = async (req, res) => {
  try {
    const [problems] = await db.query(
      `
      SELECT p.*, pc.Name as CategoryName, pc.Description as CategoryDescription,
             up.Completed, up.Attempts, up.BestTime, up.Score
      FROM problems p
      LEFT JOIN problem_categories pc ON p.CategoryID = pc.ID
      LEFT JOIN user_problems up ON p.ID = up.ProblemID AND up.UserID = ?
      WHERE p.ID = ?
    `,
      [req.user.id, req.params.id]
    );

    if (problems.length === 0) {
      return res.status(404).json({ message: "Задача не найдена" });
    }

    res.json(problems[0]);
  } catch (error) {
    console.error("Error fetching problem:", error);
    res.status(500).json({ message: "Ошибка при получении задачи" });
  }
};

const getProblemCategories = async (req, res) => {
  try {
    const [categories] = await db.query("SELECT * FROM problem_categories");
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Ошибка при получении категорий" });
  }
};

const getProblemCategoryById = async (req, res) => {
  try {
    const [categories] = await db.query(
      "SELECT * FROM problem_categories WHERE ID = ?",
      [req.params.id]
    );

    if (categories.length === 0) {
      return res.status(404).json({ message: "Категория не найдена" });
    }

    res.json(categories[0]);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Ошибка при получении категории" });
  }
};

const updateProblemProgress = async (req, res) => {
  const { problemId } = req.params;
  const { completed, time, score } = req.body;

  try {
    const [existing] = await db.query(
      "SELECT * FROM user_problems WHERE UserID = ? AND ProblemID = ?",
      [req.user.id, problemId]
    );

    if (existing.length === 0) {
      await db.query(
        "INSERT INTO user_problems (UserID, ProblemID, Completed, Attempts, LastAttempt, BestTime, Score) VALUES (?, ?, ?, 1, NOW(), ?, ?)",
        [req.user.id, problemId, completed, time, score]
      );
    } else {
      const currentRecord = existing[0];
      const newBestTime = currentRecord.BestTime
        ? Math.min(currentRecord.BestTime, time)
        : time;
      const newScore = Math.max(currentRecord.Score, score);

      await db.query(
        "UPDATE user_problems SET Completed = ?, Attempts = Attempts + 1, LastAttempt = NOW(), BestTime = ?, Score = ? WHERE UserID = ? AND ProblemID = ?",
        [completed, newBestTime, newScore, req.user.id, problemId]
      );
    }

    res.json({ message: "Прогресс обновлен" });
  } catch (error) {
    console.error("Error updating problem progress:", error);
    res.status(500).json({ message: "Ошибка при обновлении прогресса" });
  }
};

const getCategoryProblems = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const userId = req.user.ID;

    const [problems] = await db.execute(
      `SELECT 
        p.*,
        CASE 
          WHEN up.Completed = 1 THEN true 
          ELSE false 
        END as isCompleted,
        up.BestTime,
        up.Attempts,
        up.Score,
        up.LastAttempt
      FROM problems p
      LEFT JOIN user_problems up ON p.ID = up.ProblemID AND up.UserID = ?
      WHERE p.CategoryID = ?
      ORDER BY p.Difficulty ASC, p.ID ASC`,
      [userId, categoryId]
    );

    const formattedProblems = problems.map((problem) => ({
      ...problem,
      isCompleted: Boolean(problem.isCompleted),
      LastAttempt: problem.LastAttempt
        ? new Date(problem.LastAttempt).toISOString()
        : null,
      Attempts: problem.Attempts || 0,
      BestTime: problem.BestTime || null,
      Score: problem.Score || 0,
    }));

    res.json(formattedProblems);
  } catch (error) {
    console.error("Error getting category problems:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

module.exports = {
  getProblems,
  getProblemById,
  getProblemCategories,
  getProblemCategoryById,
  updateProblemProgress,
  getCategoryProblems,
};
