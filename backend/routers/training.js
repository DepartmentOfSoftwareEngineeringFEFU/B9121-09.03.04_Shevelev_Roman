const express = require("express");
const router = express.Router();
const trainingController = require("../controllers/trainingController");
const problemsController = require("../controllers/problemsController");
const { protect } = require("../middleware/authMiddleware");

router.get("/lessons", trainingController.getLessons);

router.get("/lessons/:id", protect, trainingController.getLessonById);

router.put("/lessons/:id/complete", protect, trainingController.completeLesson);

router.get("/problems/:id", trainingController.getProblemById);

router.get(
  "/problems/category/all",
  protect,
  problemsController.getProblemCategories
);
router.get(
  "/problems/category/:id",
  protect,
  problemsController.getProblemCategoryById
);
router.get(
  "/problems/category/:id/problems",
  protect,
  problemsController.getCategoryProblems
);

module.exports = router;
