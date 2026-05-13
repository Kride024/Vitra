import api from "./api";

export const getDoctors = () => api.get("/users/doctors");

export const createAppointment = (payload) => api.post("/appointments", payload);

export const getDoctorAppointments = () => api.get("/appointments/doctor");

export const getPatientAppointments = () => api.get("/appointments/patient");

export const approveAppointment = (appointmentId) =>
  api.patch(`/appointments/${appointmentId}/approve`);

export const rejectAppointment = (appointmentId, reason) =>
  api.patch(`/appointments/${appointmentId}/reject`, { reason });

export const extendCallDuration = (appointmentId, additionalMinutes) =>
  api.patch(`/appointments/${appointmentId}/extend-call`, { additionalMinutes });
