const db = require("../config/db");

const getProblemById = async (req, res) => {
  try {
    const problemId = req.params.id;
    const userId = req.user?.ID;

    const [problems] = await db.execute(
      `SELECT p.*, 
        CASE 
          WHEN up.Completed = 1 THEN true 
          ELSE false 
        END as isCompleted,
        up.BestTime,
        up.Attempts,
        up.Score
      FROM problems p
      LEFT JOIN user_problems up ON p.ID = up.ProblemID AND up.UserID = ?
      WHERE p.ID = ?`,
      [userId || 0, problemId]
    );

    if (problems.length === 0) {
      return res.status(404).json({ message: "Задача не найдена" });
    }

    const problem = problems[0];

    problem.isCompleted = Boolean(problem.isCompleted);

    res.json(problem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const getProblemStatus = async (req, res) => {
  try {
    const problemId = req.params.id;
    const userId = req.user.ID;

    const [status] = await db.execute(
      `SELECT 
        CASE 
          WHEN Completed = 1 THEN true 
          ELSE false 
        END as isCompleted,
        BestTime,
        Attempts,
        Score
      FROM user_problems 
      WHERE UserID = ? AND ProblemID = ?`,
      [userId, problemId]
    );

    if (status.length === 0) {
      return res.json({
        isCompleted: false,
        bestTime: null,
        attempts: 0,
        score: 0,
      });
    }

    res.json({
      isCompleted: Boolean(status[0].isCompleted),
      bestTime: status[0].BestTime,
      attempts: status[0].Attempts,
      score: status[0].Score,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const completeProblem = async (req, res) => {
  try {
    const problemId = req.params.id;
    const userId = req.user.ID;
    const { timeSpent, score } = req.body;

    const [existingRecord] = await db.execute(
      "SELECT * FROM user_problems WHERE UserID = ? AND ProblemID = ?",
      [userId, problemId]
    );

    if (existingRecord.length > 0) {
      const currentRecord = existingRecord[0];
      const newBestTime = currentRecord.BestTime
        ? Math.min(currentRecord.BestTime, timeSpent)
        : timeSpent;
      const newScore = Math.max(currentRecord.Score || 0, score);

      await db.execute(
        `UPDATE user_problems 
        SET 
          Completed = 1,
          BestTime = ?,
          Attempts = Attempts + 1,
          Score = ?
        WHERE UserID = ? AND ProblemID = ?`,
        [newBestTime, newScore, userId, problemId]
      );
    } else {
      await db.execute(
        `INSERT INTO user_problems 
        (UserID, ProblemID, Completed, BestTime, Attempts, Score) 
        VALUES (?, ?, 1, ?, 1, ?)`,
        [userId, problemId, timeSpent, score]
      );
    }

    const [updatedStatus] = await db.execute(
      `SELECT 
        CASE 
          WHEN Completed = 1 THEN true 
          ELSE false 
        END as isCompleted,
        BestTime,
        Attempts,
        Score
      FROM user_problems 
      WHERE UserID = ? AND ProblemID = ?`,
      [userId, problemId]
    );

    res.json({
      message: "Прогресс задачи обновлен",
      status: {
        isCompleted: Boolean(updatedStatus[0].isCompleted),
        bestTime: updatedStatus[0].BestTime,
        attempts: updatedStatus[0].Attempts,
        score: updatedStatus[0].Score,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

module.exports = {
  getProblemById,
  getProblemStatus,
  completeProblem,
};
