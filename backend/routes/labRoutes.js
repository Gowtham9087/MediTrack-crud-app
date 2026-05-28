const express = require("express");
const router = express.Router();

const {
  getLabTests,
  createLabTest,
  updateLabStatus,
  deleteLabTest
} = require("../controllers/labController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getLabTests);
router.post("/", authMiddleware, createLabTest);
router.put("/:id", authMiddleware, updateLabStatus);
router.delete("/:id", authMiddleware, deleteLabTest);

module.exports = router;