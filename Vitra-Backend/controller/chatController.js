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

const getCallWindow = (appointment) => {
  const start = appointment?.scheduledAt ? new Date(appointment.scheduledAt) : null;
  const baseDuration = Number(appointment?.callDurationMinutes || 60);
  const extendedDuration = Number(appointment?.callExtendedMinutes || 0);
  const totalDurationMinutes = baseDuration + extendedDuration;

  if (!start || Number.isNaN(start.getTime())) {
    return {
      startAt: null,
      endAt: null,
      totalDurationMinutes,
      isActive: false,
      minutesRemaining: 0,
    };
  }

  const end = new Date(start.getTime() + totalDurationMinutes * 60 * 1000);
  const now = new Date();
  const isActive = now >= start && now <= end;
  const minutesRemaining = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 60000));

  return {
    startAt: start,
    endAt: end,
    totalDurationMinutes,
    isActive,
    minutesRemaining,
  };
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
    const callWindow = getCallWindow(appointment);

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
        scheduledAt: appointment.scheduledAt,
        callDurationMinutes: appointment.callDurationMinutes,
        callExtendedMinutes: appointment.callExtendedMinutes,
        healthDescription: appointment.healthDescription,
        createdAt: appointment.createdAt,
      },
      callWindow: {
        startAt: callWindow.startAt,
        endAt: callWindow.endAt,
        totalDurationMinutes: callWindow.totalDurationMinutes,
        isActive: callWindow.isActive,
        minutesRemaining: callWindow.minutesRemaining,
      },
      messages,
    });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || "Failed to load chat" });
  }
};

const getVideoCallAccessContext = async (userId, appointmentId) => {
  const { appointment, user } = await getChatAccessContext(userId, appointmentId);

  if (!appointment.scheduledAt) {
    throw createHttpError(400, "Appointment schedule is missing");
  }

 const now = new Date();
const start = new Date(appointment.scheduledAt);

// allow 10 min early join
if (now < start.getTime() - 10 * 60 * 1000) {
  throw createHttpError(403, "Video call not started yet");
}

  return { appointment, user, callWindow };
};

module.exports = {
  getChatThread,
  getChatAccessContext,
  getVideoCallAccessContext,
  getCallWindow,
  normalizeRole,
};