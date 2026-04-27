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

module.exports = {
  createAppointment,
  getDoctorAppointments,
};
