const jwt = require("jsonwebtoken");
const db = require("../config/db");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token,
        "djsdfjjh39130r-324-hfdsfiicm3282jdf-dsf"
      );

      const [users] = await db.execute(
        "SELECT ID, Nickname FROM users WHERE ID = ?",
        [decoded.userId]
      );

      if (users.length === 0) {
        return res
          .status(401)
          .json({ message: "Не авторизован, пользователь не найден" });
      }

      req.user = users[0];

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Не авторизован, токен недействителен" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Не авторизован, нет токена" });
  }
};

module.exports = { protect };
