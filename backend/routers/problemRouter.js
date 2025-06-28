const express = require("express");
const router = express.Router();
const problemController = require("../controllers/problemController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:id", problemController.getProblemById);

router.get("/:id/status", protect, problemController.getProblemStatus);

router.post("/:id/complete", protect, problemController.completeProblem);

module.exports = router;
