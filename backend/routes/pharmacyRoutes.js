const express = require("express");

const router = express.Router();

const {
  getMedicines,
  createMedicine,
  deleteMedicine,
} = require("../controllers/pharmacyController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getMedicines);

router.post("/", authMiddleware, createMedicine);

router.delete("/:id", authMiddleware, deleteMedicine);

module.exports = router;