const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const db = require("../config/db");
const { protect } = require("../middleware/authMiddleware");

router.get("/search", protect, usersController.searchUsers);

router.post("/register", usersController.registerUser);
router.post("/login", usersController.loginUser);

router.get("/nickname/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const [rows] = await db.execute("SELECT Nickname FROM users WHERE ID = ?", [
      userId,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    res.json({ nickname: rows[0].Nickname });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.put("/:userId", protect, usersController.updateUserProfile);

router.post("/request-trainer", protect, usersController.requestTrainer);

const adminBasicAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Basic ")) {
    res.set("WWW-Authenticate", 'Basic realm="Admin Area"');
    return res.status(401).send("Требуется авторизация администратора");
  }
  const base64 = auth.split(" ")[1];
  const [login, password] = Buffer.from(base64, "base64").toString().split(":");
  if (login === "admin" && password === "123") {
    return next();
  }
  res.set("WWW-Authenticate", 'Basic realm="Admin Area"');
  return res.status(401).send("Неверный логин или пароль администратора");
};

router.get(
  "/admin/pending-trainers",
  adminBasicAuth,
  usersController.getPendingTrainers
);
router.post(
  "/admin/approve-trainer/:userId",
  adminBasicAuth,
  usersController.approveTrainer
);
router.post(
  "/admin/reject-trainer/:userId",
  adminBasicAuth,
  usersController.rejectTrainer
);
router.get("/admin/trainers", adminBasicAuth, usersController.getAllTrainers);
router.post(
  "/admin/revoke-trainer/:userId",
  adminBasicAuth,
  usersController.revokeTrainer
);

router.get("/trainer/groups", protect, usersController.getTrainerGroups);
router.post("/trainer/groups", protect, usersController.createGroup);
router.post("/trainer/invite", protect, usersController.inviteUserToGroup);

router.get("/group-invites", protect, usersController.getUserGroupInvites);
router.post(
  "/group-invites/accept",
  protect,
  usersController.acceptGroupInvite
);
router.post(
  "/group-invites/decline",
  protect,
  usersController.declineGroupInvite
);

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const [rows] = await db.execute(
      "SELECT Role, Nickname, Email, Rating, GamesPlayed, Wins, Losses, Draws FROM users WHERE ID = ?",
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
