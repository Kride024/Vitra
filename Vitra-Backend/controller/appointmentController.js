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
    const { doctorUserId, healthDescription, reportNotes, imageAttachment, reportAttachment } = req.body;

    if (!doctorUserId || !healthDescription) {
      return res.status(400).json({ message: "doctorUserId and healthDescription are required" });
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
      order: [["createdAt", "DESC"]],
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
      order: [["createdAt", "DESC"]],
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

module.exports = {
  createAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  approveAppointment,
  rejectAppointment,
};
