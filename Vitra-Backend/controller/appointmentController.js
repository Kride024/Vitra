const Appointment = require("../models/Appointment");
const User = require("../models/User");

const normalizeRole = (role) => {
  if (!role) return null;
  const upperRole = String(role).toUpperCase();
  if (upperRole === "ADMIN") return "DOCTOR";
  if (upperRole === "USER") return "PATIENT";
  return upperRole;
};

const createAppointment = async (req, res) => {
  try {
    const { doctorUserId, scheduledAt, healthDescription, reportNotes, imageAttachment, reportAttachment } = req.body;

    if (!doctorUserId || !scheduledAt || !healthDescription) {
      return res.status(400).json({ message: "doctorUserId, scheduledAt and healthDescription are required" });
    }

    const parsedScheduledAt = new Date(scheduledAt);
    if (Number.isNaN(parsedScheduledAt.getTime())) {
      return res.status(400).json({ message: "Invalid scheduledAt format" });
    }

    if (parsedScheduledAt.getTime() < Date.now()) {
      return res.status(400).json({ message: "Appointment time must be in the future" });
    }

    const patient = await User.findByPk(req.user.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const patientRole = normalizeRole(patient.role);
    if (patientRole !== "PATIENT") {
      return res.status(403).json({ message: "Only patients can book appointments" });
    }

    const doctor = await User.findByPk(doctorUserId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const doctorRole = normalizeRole(doctor.role);
    if (doctorRole !== "DOCTOR") {
      return res.status(400).json({ message: "Selected user is not a doctor" });
    }

    const appointment = await Appointment.create({
      patientUserId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      patientEmail: patient.email,
      patientPhone: patient.phone,
      doctorUserId: doctor.id,
      doctorName: `${doctor.firstName} ${doctor.lastName}`,
      doctorEmail: doctor.email,
      scheduledAt: parsedScheduledAt,
      callDurationMinutes: 60,
      callExtendedMinutes: 0,
      healthDescription,
      reportNotes: reportNotes || null,
      imageAttachment: imageAttachment || null,
      reportAttachment: reportAttachment || null,
    });

    return res.status(201).json({ message: "Appointment booked", appointment });
  } catch (error) {
    console.error("Create appointment error:", error);
    return res.status(500).json({ message: "Failed to create appointment" });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await User.findByPk(req.user.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const doctorRole = normalizeRole(doctor.role);
    if (doctorRole !== "DOCTOR") {
      return res.status(403).json({ message: "Only doctors can view this data" });
    }

    const appointments = await Appointment.findAll({
      where: { doctorUserId: req.user.id },
      order: [["scheduledAt", "ASC"]],
    });

    return res.json({ appointments });
  } catch (error) {
    console.error("Get doctor appointments error:", error);
    return res.status(500).json({ message: "Failed to fetch doctor appointments" });
  }
};

const getPatientAppointments = async (req, res) => {
  try {
    const patient = await User.findByPk(req.user.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const patientRole = normalizeRole(patient.role);
    if (patientRole !== "PATIENT") {
      return res.status(403).json({ message: "Only patients can view this data" });
    }

    const appointments = await Appointment.findAll({
      where: { patientUserId: req.user.id },
      order: [["scheduledAt", "ASC"]],
    });

    return res.json({ appointments });
  } catch (error) {
    console.error("Get patient appointments error:", error);
    return res.status(500).json({ message: "Failed to fetch patient appointments" });
  }
};

const approveAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    if (!appointmentId) {
      return res.status(400).json({ message: "appointmentId is required" });
    }

    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Verify doctor ownership
    if (appointment.doctorUserId !== req.user.id) {
      return res.status(403).json({ message: "You can only approve your own appointments" });
    }

    // Verify appointment is still pending
    if (appointment.status !== "PENDING") {
      return res.status(400).json({ message: `Cannot approve appointment with status: ${appointment.status}` });
    }

    appointment.status = "APPROVED";
    await appointment.save();

    return res.json({ message: "Appointment approved successfully", appointment });
  } catch (error) {
    console.error("Approve appointment error:", error);
    return res.status(500).json({ message: "Failed to approve appointment" });
  }
};

const rejectAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { reason } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ message: "appointmentId is required" });
    }

    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Verify doctor ownership
    if (appointment.doctorUserId !== req.user.id) {
      return res.status(403).json({ message: "You can only reject your own appointments" });
    }

    // Verify appointment is still pending
    if (appointment.status !== "PENDING") {
      return res.status(400).json({ message: `Cannot reject appointment with status: ${appointment.status}` });
    }

    appointment.status = "REJECTED";
    appointment.reportNotes = reason || appointment.reportNotes;
    await appointment.save();

    return res.json({ message: "Appointment rejected successfully", appointment });
  } catch (error) {
    console.error("Reject appointment error:", error);
    return res.status(500).json({ message: "Failed to reject appointment" });
  }
};

const extendCallDuration = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { additionalMinutes } = req.body;

    const parsedAdditionalMinutes = Number(additionalMinutes);
    if (!appointmentId || !Number.isInteger(parsedAdditionalMinutes) || parsedAdditionalMinutes <= 0) {
      return res.status(400).json({ message: "Valid appointmentId and positive integer additionalMinutes are required" });
    }

    if (parsedAdditionalMinutes > 120) {
      return res.status(400).json({ message: "additionalMinutes cannot exceed 120 per request" });
    }

    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.doctorUserId !== req.user.id) {
      return res.status(403).json({ message: "Only the assigned doctor can extend call duration" });
    }

    if (appointment.status !== "APPROVED") {
      return res.status(400).json({ message: "Call duration can be extended only for approved appointments" });
    }

    appointment.callExtendedMinutes = (appointment.callExtendedMinutes || 0) + parsedAdditionalMinutes;
    await appointment.save();

    return res.json({
      message: "Call duration extended successfully",
      appointment,
    });
  } catch (error) {
    console.error("Extend call duration error:", error);
    return res.status(500).json({ message: "Failed to extend call duration" });
  }
};

module.exports = {
  createAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  approveAppointment,
  rejectAppointment,
  extendCallDuration,
};
