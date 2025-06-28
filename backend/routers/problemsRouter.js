const express = require("express");
const router = express.Router();
const problemsController = require("../controllers/problemsController");
const problemController = require("../controllers/problemController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, problemsController.getProblems);

router.get("/category/all", protect, problemsController.getProblemCategories);

router.get("/category/:id", protect, problemsController.getProblemCategoryById);

router.get(
  "/category/:id/problems",
  protect,
  problemsController.getCategoryProblems
);

router.get("/:id", problemController.getProblemById);

router.get("/:id/status", protect, problemController.getProblemStatus);

router.post("/:id/complete", protect, problemController.completeProblem);

router.post(
  "/:problemId/progress",
  protect,
  problemsController.updateProblemProgress
);

module.exports = router;
