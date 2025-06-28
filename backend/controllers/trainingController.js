const db = require("../config/db");
const jwt = require("jsonwebtoken");

const getLessons = async (req, res) => {
  try {
    let userId = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(
          token,
          "djsdfjjh39130r-324-hfdsfiicm3282jdf-dsf"
        );
        userId = decoded.userId;
      } catch (error) {
        console.error("Ошибка при проверке токена:", error);
      }
    }

    let query = `
      SELECT 
        l.ID, 
        l.Title, 
        l.Description, 
        l.Difficulty, 
        l.Topic,
        IF(ul.Completed IS NULL OR ul.Completed = 0, false, true) as isCompleted
      FROM lessons l
      ${userId ? 'LEFT JOIN userlessons ul ON l.ID = ul.LessonID AND ul.UserID = ?' : 'LEFT JOIN userlessons ul ON 1=0'}
    `;

    const [lessons] = await db.execute(query, userId ? [userId] : []);

    const formattedLessons = lessons.map((lesson) => ({
      ...lesson,
      isCompleted: Boolean(lesson.isCompleted),
    }));

    res.json(formattedLessons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const getLessonById = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const userId = req.user.ID;

    const [lessons] = await db.execute("SELECT * FROM lessons WHERE ID = ?", [
      lessonId,
    ]);

    if (lessons.length === 0) {
      return res.status(404).json({ message: "Урок не найден" });
    }

    const lesson = lessons[0];
    let isCompleted = false;

    if (userId) {
      const [userLessons] = await db.execute(
        "SELECT Completed FROM userlessons WHERE UserID = ? AND LessonID = ?",
        [userId, lessonId]
      );

      if (userLessons.length > 0 && userLessons[0].Completed === 1) {
        isCompleted = true;
      }
    }

    res.json({ ...lesson, isCompleted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const completeLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const userId = req.user.ID;

    const [existingUserLesson] = await db.execute(
      "SELECT * FROM userlessons WHERE UserID = ? AND LessonID = ?",
      [userId, lessonId]
    );

    if (existingUserLesson.length > 0) {
      if (!existingUserLesson[0].Completed) {
        await db.execute(
          "UPDATE userlessons SET Completed = TRUE WHERE UserID = ? AND LessonID = ?",
          [userId, lessonId]
        );
        res.json({ message: "Прогресс урока обновлен" });
      } else {
        res.json({ message: "Урок уже был пройден" });
      }
    } else {
      await db.execute(
        "INSERT INTO userlessons (UserID, LessonID, Completed) VALUES (?, ?, TRUE)",
        [userId, lessonId]
      );
      res.status(201).json({ message: "Прогресс урока создан" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const getProblemById = async (req, res) => {
  try {
    const problemId = req.params.id;

    const [problems] = await db.execute("SELECT * FROM problems WHERE ID = ?", [
      problemId,
    ]);

    if (problems.length === 0) {
      return res
        .status(404)
        .json({ message: `Задача с ID ${problemId} не найдена` });
    }

    res.json(problems[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера при получении задачи" });
  }
};

module.exports = {
  getLessons,
  getLessonById,
  completeLesson,
  getProblemById,
};
