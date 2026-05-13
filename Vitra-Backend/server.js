const express = require("express");
const cors = require("cors");
const http = require("http");
require('dotenv').config();
const jwt = require("jsonwebtoken");
const sequelize = require("./config/db");
require("./models/User");
require("./models/Appointment");
require("./models/ChatMessage");

const userRoutes = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { Server } = require("socket.io");
const { getChatAccessContext, getVideoCallAccessContext, normalizeRole } = require("./controller/chatController");
const ChatMessage = require("./models/ChatMessage");

const app = express();
const server = http.createServer(app);

// Parse allowed origins from environment variable
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  let isVercelPreview = false;
  try {
    isVercelPreview = /\.vercel\.app$/.test(new URL(origin).hostname);
  } catch (error) {
    isVercelPreview = false;
  }

  return allowedOrigins.includes(origin) || isVercelPreview;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      console.warn(`CORS blocked origin: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/chats", chatRoutes);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Unauthorized"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    return next();
  } catch (error) {
    return next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  socket.on("chat:join", async ({ appointmentId }) => {
    try {
      if (!appointmentId) {
        throw new Error("appointmentId is required");
      }

      const { appointment } = await getChatAccessContext(socket.user.id, appointmentId);
      const roomName = `appointment:${appointment.id}`;

      socket.join(roomName);
      socket.emit("chat:joined", {
        appointmentId: appointment.id,
        roomName,
      });
    } catch (error) {
      socket.emit("chat:error", {
        message: error.message || "Unable to join chat room",
      });
    }
  });

  socket.on("chat:message", async ({ appointmentId, message }) => {
    try {
      const trimmedMessage = String(message || "").trim();
      if (!appointmentId || !trimmedMessage) {
        throw new Error("appointmentId and message are required");
      }

      const { appointment, user } = await getChatAccessContext(socket.user.id, appointmentId);
      const roomName = `appointment:${appointment.id}`;
      const senderRole = normalizeRole(user.role);
      const senderName = `${user.firstName} ${user.lastName}`.trim();

      const savedMessage = await ChatMessage.create({
        appointmentId: appointment.id,
        senderUserId: user.id,
        senderRole,
        senderName,
        message: trimmedMessage,
      });

      io.to(roomName).emit("chat:message", {
        id: savedMessage.id,
        appointmentId: savedMessage.appointmentId,
        senderUserId: savedMessage.senderUserId,
        senderRole: savedMessage.senderRole,
        senderName: savedMessage.senderName,
        message: savedMessage.message,
        createdAt: savedMessage.createdAt,
      });
    } catch (error) {
      socket.emit("chat:error", {
        message: error.message || "Unable to send chat message",
      });
    }
  });

  socket.on("video:join", async ({ appointmentId }) => {
    try {
      if (!appointmentId) {
        throw new Error("appointmentId is required");
      }

      const { appointment, callWindow } = await getVideoCallAccessContext(socket.user.id, appointmentId);
      const roomName = `video:${appointment.id}`;

      socket.join(roomName);
      const participantCount = io.sockets.adapter.rooms.get(roomName)?.size || 1;

      socket.emit("video:joined", {
        appointmentId: appointment.id,
        roomName,
        participantCount,
        callWindow,
      });

      socket.to(roomName).emit("video:peer-ready", {
        appointmentId: appointment.id,
      });
    } catch (error) {
      socket.emit("video:error", {
        message: error.message || "Unable to join video call",
      });
    }
  });

  socket.on("video:leave", ({ appointmentId }) => {
    if (!appointmentId) return;
    const roomName = `video:${appointmentId}`;
    socket.leave(roomName);
    socket.to(roomName).emit("video:peer-left", { appointmentId });
  });

  socket.on("video:offer", async ({ appointmentId, offer }) => {
    try {
      if (!appointmentId || !offer) {
        throw new Error("appointmentId and offer are required");
      }

      await getVideoCallAccessContext(socket.user.id, appointmentId);
      socket.to(`video:${appointmentId}`).emit("video:offer", {
        appointmentId,
        offer,
      });
    } catch (error) {
      socket.emit("video:error", {
        message: error.message || "Unable to send offer",
      });
    }
  });

  socket.on("video:answer", async ({ appointmentId, answer }) => {
    try {
      if (!appointmentId || !answer) {
        throw new Error("appointmentId and answer are required");
      }

      await getVideoCallAccessContext(socket.user.id, appointmentId);
      socket.to(`video:${appointmentId}`).emit("video:answer", {
        appointmentId,
        answer,
      });
    } catch (error) {
      socket.emit("video:error", {
        message: error.message || "Unable to send answer",
      });
    }
  });

  socket.on("video:ice-candidate", async ({ appointmentId, candidate }) => {
    try {
      if (!appointmentId || !candidate) {
        throw new Error("appointmentId and candidate are required");
      }

      await getVideoCallAccessContext(socket.user.id, appointmentId);
      socket.to(`video:${appointmentId}`).emit("video:ice-candidate", {
        appointmentId,
        candidate,
      });
    } catch (error) {
      socket.emit("video:error", {
        message: error.message || "Unable to send ICE candidate",
      });
    }
  });
});

const PORT = process.env.PORT || 10000;
// Show which DB host/port we will attempt to connect to (helps debug mismatched ports)
console.log(`DB host: ${process.env.DB_HOST || "(not set)"}`);
console.log(`DB port: ${process.env.DB_PORT || "(not set)"}`);

const startServer = async () => {
  const maxAttempts = 5;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await sequelize.authenticate();
      console.log("✅ Connected to Aiven MySQL");
      await sequelize.sync({ alter: true });
      console.log("Models synced with MySQL");
      server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
      return;
    } catch (err) {
      // Log full error object to aid debugging (stack, code, errno, etc.)
      console.error(`⚠️  DB/Sync error (attempt ${attempt}/${maxAttempts}):`, err);
      if (attempt < maxAttempts) {
        const backoffMs = attempt * 2000;
        console.log(`Retrying DB connection in ${backoffMs}ms...`);
        await new Promise((r) => setTimeout(r, backoffMs));
      }
    }
  }

  console.log("⚠️  Starting server without database connection...");
  server.listen(PORT, () => console.log(`Server is running on port ${PORT} (DB offline)`));
};

startServer();
