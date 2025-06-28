const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { nickname, email, password } = req.body;

    if (!nickname || !email || !password) {
      return res
        .status(400)
        .json({ message: "Пожалуйста, заполните все поля." });
    }

    if (password !== req.body.confirmPassword) {
      return res.status(400).json({ message: "Пароли не совпадают" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [nicknameRows] = await db.execute(
      "SELECT * FROM users WHERE Nickname = ?",
      [nickname]
    );

    if (nicknameRows.length > 0) {
      return res.status(409).json({ message: "Этот никнейм уже занят" });
    }

    const [emailRows] = await db.execute(
      "SELECT * FROM users WHERE Email = ?",
      [email]
    );

    if (emailRows.length > 0) {
      return res.status(409).json({ message: "Этот email уже занят" });
    }

    const [result] = await db.execute(
      "INSERT INTO users (Nickname, Email, Password) VALUES (?, ?, ?)",
      [nickname, email, hashedPassword]
    );

    res.status(201).json({
      message: "Пользователь успешно зарегистрирован",
      userId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Пожалуйста, заполните все поля." });
    }

    const [rows] = await db.execute(
      "SELECT * FROM users WHERE Email = ? OR Nickname = ?",
      [identifier, identifier]
    );

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ message: "Неверный email/никнейм или пароль" });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.Password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Неверный email/никнейм или пароль" });
    }

    const token = jwt.sign(
      { userId: user.ID },
      "djsdfjjh39130r-324-hfdsfiicm3282jdf-dsf",
      {
        expiresIn: "1y",
      }
    );

    res.json({ token, userId: user.ID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const updateUserProfile = async (req, res) => {
  const userId = req.user?.ID || req.user?.id || req.params.userId;
  const { nickname, email } = req.body;

  if (!nickname || !email) {
    return res.status(400).json({ message: "Пожалуйста, заполните все поля." });
  }

  try {
    // Проверка уникальности email
    const [emailRows] = await db.execute(
      "SELECT ID FROM users WHERE Email = ? AND ID != ?",
      [email, userId]
    );
    if (emailRows.length > 0) {
      return res.status(409).json({ message: "Этот email уже занят" });
    }

    // Проверка уникальности никнейма
    const [nickRows] = await db.execute(
      "SELECT ID FROM users WHERE Nickname = ? AND ID != ?",
      [nickname, userId]
    );
    if (nickRows.length > 0) {
      return res.status(409).json({ message: "Этот никнейм уже занят" });
    }

    // Обновление данных
    await db.execute(
      "UPDATE users SET Nickname = ?, Email = ? WHERE ID = ?",
      [nickname, email, userId]
    );

    res.json({ message: "Данные профиля успешно обновлены" });
  } catch (error) {
    console.error("Ошибка при обновлении профиля:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const requestTrainer = async (req, res) => {
  const userId = req.user?.ID || req.user?.id;
  try {
    await db.execute("UPDATE users SET Role = 'PendingTrainer' WHERE ID = ?", [userId]);
    res.json({ message: "Заявка на роль тренера отправлена" });
  } catch (error) {
    console.error("Ошибка при подаче заявки на тренера:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const getPendingTrainers = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT ID, Nickname, Email FROM users WHERE Role = 'PendingTrainer'");
    res.json(rows);
  } catch (error) {
    console.error("Ошибка при получении заявок на тренера:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const approveTrainer = async (req, res) => {
  const { userId } = req.params;
  try {
    await db.execute("UPDATE users SET Role = 'Trainer' WHERE ID = ? AND Role = 'PendingTrainer'", [userId]);
    res.json({ message: "Пользователь назначен тренером" });
  } catch (error) {
    console.error("Ошибка при одобрении тренера:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const rejectTrainer = async (req, res) => {
  const { userId } = req.params;
  try {
    await db.execute("UPDATE users SET Role = 'User' WHERE ID = ? AND Role = 'PendingTrainer'", [userId]);
    res.json({ message: "Заявка отклонена, роль пользователя возвращена к обычной" });
  } catch (error) {
    console.error("Ошибка при отклонении заявки:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const getAllTrainers = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT ID, Nickname, Email FROM users WHERE Role = 'Trainer'");
    res.json(rows);
  } catch (error) {
    console.error("Ошибка при получении тренеров:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const revokeTrainer = async (req, res) => {
  const { userId } = req.params;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    // 1. Найти все группы тренера
    const [groups] = await conn.execute("SELECT ID FROM study_groups WHERE TrainerID = ?", [userId]);
    const groupIds = groups.map(g => g.ID);
    if (groupIds.length > 0) {
      // 2. Удалить всех участников из этих групп
      await conn.execute(
        `DELETE FROM group_members WHERE GroupID IN (${groupIds.map(() => '?').join(',')})`,
        groupIds
      );
      // 3. Удалить сами группы
      await conn.execute(
        `DELETE FROM study_groups WHERE ID IN (${groupIds.map(() => '?').join(',')})`,
        groupIds
      );
    }
    // 4. Сменить роль пользователя
    await conn.execute("UPDATE users SET Role = 'User' WHERE ID = ? AND Role = 'Trainer'", [userId]);
    await conn.commit();
    res.json({ message: "Права тренера отозваны, группы и участники удалены" });
  } catch (error) {
    await conn.rollback();
    console.error("Ошибка при отзыве прав тренера:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  } finally {
    conn.release();
  }
};

const getTrainerGroups = async (req, res) => {
  const trainerId = req.user?.ID || req.user?.id;
  try {
    const [groups] = await db.execute(
      "SELECT ID, Name, Description, CreatedAt FROM study_groups WHERE TrainerID = ?",
      [trainerId]
    );
    res.json(groups);
  } catch (error) {
    console.error("Ошибка при получении групп тренера:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const createGroup = async (req, res) => {
  const trainerId = req.user?.ID || req.user?.id;
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Название группы обязательно" });
  }
  try {
    await db.execute(
      "INSERT INTO study_groups (Name, TrainerID, Description) VALUES (?, ?, ?)",
      [name, trainerId, description || null]
    );
    res.json({ message: "Группа создана" });
  } catch (error) {
    console.error("Ошибка при создании группы:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const INVITE_PENDING_DATE = '1900-01-01 00:00:00';

// Получить все приглашения пользователя (ожидающие согласия)
const getUserGroupInvites = async (req, res) => {
  const userId = req.user?.ID || req.user?.id;
  try {
    const [invites] = await db.execute(
      `SELECT gm.GroupID, sg.Name as GroupName, sg.Description, sg.TrainerID, u.Nickname as TrainerName
       FROM group_members gm
       JOIN study_groups sg ON gm.GroupID = sg.ID
       JOIN users u ON sg.TrainerID = u.ID
       WHERE gm.UserID = ? AND gm.JoinedAt = ?`,
      [userId, INVITE_PENDING_DATE]
    );
    res.json(invites);
  } catch (error) {
    console.error("Ошибка при получении приглашений в группы:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Принять приглашение
const acceptGroupInvite = async (req, res) => {
  const userId = req.user?.ID || req.user?.id;
  const { groupId } = req.body;
  try {
    const [rows] = await db.execute(
      "SELECT * FROM group_members WHERE GroupID = ? AND UserID = ? AND JoinedAt = ?",
      [groupId, userId, INVITE_PENDING_DATE]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Приглашение не найдено" });
    }
    await db.execute(
      "UPDATE group_members SET JoinedAt = NOW() WHERE GroupID = ? AND UserID = ? AND JoinedAt = ?",
      [groupId, userId, INVITE_PENDING_DATE]
    );
    res.json({ message: "Вы вступили в группу" });
  } catch (error) {
    console.error("Ошибка при принятии приглашения:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Отклонить приглашение
const declineGroupInvite = async (req, res) => {
  const userId = req.user?.ID || req.user?.id;
  const { groupId } = req.body;
  try {
    const [rows] = await db.execute(
      "SELECT * FROM group_members WHERE GroupID = ? AND UserID = ? AND JoinedAt = ?",
      [groupId, userId, INVITE_PENDING_DATE]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Приглашение не найдено" });
    }
    await db.execute(
      "DELETE FROM group_members WHERE GroupID = ? AND UserID = ? AND JoinedAt = ?",
      [groupId, userId, INVITE_PENDING_DATE]
    );
    res.json({ message: "Приглашение отклонено" });
  } catch (error) {
    console.error("Ошибка при отклонении приглашения:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Модифицируем inviteUserToGroup для создания приглашения с магической датой
const inviteUserToGroup = async (req, res) => {
  const trainerId = req.user?.ID || req.user?.id;
  const { groupId, userId } = req.body;
  try {
    // Проверяем, что группа принадлежит тренеру
    const [groups] = await db.execute(
      "SELECT ID FROM study_groups WHERE ID = ? AND TrainerID = ?",
      [groupId, trainerId]
    );
    if (groups.length === 0) {
      return res.status(403).json({ message: "Нет доступа к этой группе" });
    }
    // Проверяем, что пользователь существует
    const [users] = await db.execute(
      "SELECT ID FROM users WHERE ID = ?",
      [userId]
    );
    if (users.length === 0) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    // Проверяем, что пользователь не состоит в группе и не приглашён
    const [members] = await db.execute(
      "SELECT * FROM group_members WHERE GroupID = ? AND UserID = ?",
      [groupId, userId]
    );
    if (members.length > 0) {
      if (members[0].JoinedAt === INVITE_PENDING_DATE) {
        return res.status(409).json({ message: "Пользователь уже приглашён, ожидает согласия" });
      } else {
        return res.status(409).json({ message: "Пользователь уже в группе" });
      }
    }
    // Добавляем приглашение
    await db.execute(
      "INSERT INTO group_members (GroupID, UserID, JoinedAt) VALUES (?, ?, ?)",
      [groupId, userId, INVITE_PENDING_DATE]
    );
    res.json({ message: "Приглашение отправлено" });
  } catch (error) {
    console.error("Ошибка при приглашении пользователя в группу:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Поиск пользователей по email или никнейму (для автодополнения приглашения)
const searchUsers = async (req, res) => {
  const { query } = req.query;
  if (!query || query.length < 3) return res.json([]);
  try {
    const [rows] = await db.execute(
      `SELECT ID, Nickname, Email FROM users WHERE (Email LIKE ? OR Nickname LIKE ?) LIMIT 10`,
      [`%${query}%`, `%${query}%`]
    );
    res.json(rows);
  } catch (error) {
    console.error("Ошибка поиска пользователей:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

module.exports = { registerUser, loginUser, updateUserProfile, requestTrainer, getPendingTrainers, approveTrainer, rejectTrainer, getAllTrainers, revokeTrainer, getTrainerGroups, createGroup, inviteUserToGroup, getUserGroupInvites, acceptGroupInvite, declineGroupInvite, searchUsers };
