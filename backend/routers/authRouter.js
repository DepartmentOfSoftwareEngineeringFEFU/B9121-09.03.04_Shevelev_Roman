const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
  const { nickname, email, password } = req.body;

  try {
    const [existingUsers] = await db.execute(
      'SELECT * FROM users WHERE Email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res
        .status(400)
        .json({ message: "Пользователь с таким email уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      'INSERT INTO users (Nickname, Email, Password) VALUES (?, ?, ?)',
      [nickname, email, hashedPassword]
    );

    const token = jwt.sign(
      { userId: result.insertId },
      "djsdfjjh39130r-324-hfdsfiicm3282jdf-dsf",
      { expiresIn: "30d" }
    );

    res.status(201).json({
      token,
      user: {
        id: result.insertId,
        nickname,
        email,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Ошибка при регистрации" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Ищем пользователя по email
    const [users] = await db.execute(
      'SELECT * FROM users WHERE Email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Неверный email или пароль" });
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.Password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Неверный email или пароль" });
    }

    const token = jwt.sign(
      { userId: user.ID },
      "djsdfjjh39130r-324-hfdsfiicm3282jdf-dsf",
      { expiresIn: "30d" }
    );

    res.json({
      token,
      user: {
        id: user.ID,
        nickname: user.Nickname,
        email: user.Email,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Ошибка при входе" });
  }
});

module.exports = router;
