const express = require("express");
const router = express.Router();

const {
  addFeedback,
  getFeedbacks,
  deleteFeedback,
} = require("../controllers/feedbackController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("user"),
  addFeedback
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getFeedbacks
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteFeedback
);

module.exports = router;