const express = require("express");
const router = express.Router();

const {
  addFeedback,
  getFeedbacks,
  getMyFeedbacks,
  deleteFeedback,
} = require("../controllers/feedbackController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Patient submits feedback
router.post("/", authMiddleware, roleMiddleware("user"), addFeedback);

// Patient fetches their own feedbacks (to check already submitted)
router.get("/my", authMiddleware, roleMiddleware("user"), getMyFeedbacks);

// Admin views all feedbacks
router.get("/", authMiddleware, roleMiddleware("admin"), getFeedbacks);

// Admin deletes feedback
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteFeedback);

module.exports = router;