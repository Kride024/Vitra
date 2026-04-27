import api from "./api";

export const getDoctors = () => api.get("/users/doctors");

export const createAppointment = (payload) => api.post("/appointments", payload);

export const getDoctorAppointments = () => api.get("/appointments/doctor");
