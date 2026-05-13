import api from "./api";

export const getChatThread = (appointmentId) => api.get(`/chats/${appointmentId}`);