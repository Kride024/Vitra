const Appointment = require("../models/Appointment");
const User = require("../models/User");
const ChatMessage = require("../models/ChatMessage");

const normalizeRole = (role) => {
  if (!role) return null;

  const upperRole = String(role).toUpperCase();
  if (upperRole === "ADMIN") return "DOCTOR";
  if (upperRole === "USER") return "PATIENT";

  return upperRole;
};

const createHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const getChatAccessContext = async (userId, appointmentId) => {
  const appointment = await Appointment.findByPk(appointmentId);

  if (!appointment) {
    throw createHttpError(404, "Appointment not found");
  }

  if (appointment.status !== "APPROVED") {
    throw createHttpError(403, "Chat is available only after appointment approval");
  }

  if (appointment.patientUserId !== userId && appointment.doctorUserId !== userId) {
    throw createHttpError(403, "You are not a participant in this chat");
  }

  const user = await User.findByPk(userId, {
    attributes: ["id", "firstName", "lastName", "role"],
  });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  return { appointment, user };
};

const getChatThread = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { appointment } = await getChatAccessContext(req.user.id, appointmentId);

    const messages = await ChatMessage.findAll({
      where: { appointmentId },
      order: [["createdAt", "ASC"]],
    });

    return res.json({
      appointment: {
        id: appointment.id,
        status: appointment.status,
        patientUserId: appointment.patientUserId,
        patientName: appointment.patientName,
        patientEmail: appointment.patientEmail,
        doctorUserId: appointment.doctorUserId,
        doctorName: appointment.doctorName,
        doctorEmail: appointment.doctorEmail,
        healthDescription: appointment.healthDescription,
        createdAt: appointment.createdAt,
      },
      messages,
    });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || "Failed to load chat" });
  }
};

module.exports = {
  getChatThread,
  getChatAccessContext,
  normalizeRole,
};