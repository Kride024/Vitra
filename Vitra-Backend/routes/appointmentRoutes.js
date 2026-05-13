const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/authMiddleware");
const {
  createAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  approveAppointment,
  rejectAppointment,
  extendCallDuration,
} = require("../controller/appointmentController");

router.post("/", authMiddleware, createAppointment);
router.get("/doctor", authMiddleware, getDoctorAppointments);
router.get("/patient", authMiddleware, getPatientAppointments);
router.patch("/:appointmentId/approve", authMiddleware, approveAppointment);
router.patch("/:appointmentId/reject", authMiddleware, rejectAppointment);
router.patch("/:appointmentId/extend-call", authMiddleware, extendCallDuration);

module.exports = router;
