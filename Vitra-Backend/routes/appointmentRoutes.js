const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/authMiddleware");
const {
  createAppointment,
  getDoctorAppointments,
} = require("../controller/appointmentController");

router.post("/", authMiddleware, createAppointment);
router.get("/doctor", authMiddleware, getDoctorAppointments);

module.exports = router;
