const express = require("express");
const router = express.Router();

const {
  addPatient,
  getPatients,
  getPatientByEmail,
  updatePatient,
  deletePatient,
} = require("../controllers/patientController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  addPatient
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getPatients
);

router.get(
  "/email/:email",
  authMiddleware,
  getPatientByEmail
);

router.put(
  "/:id",
  authMiddleware,
  updatePatient
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deletePatient
);

module.exports = router;