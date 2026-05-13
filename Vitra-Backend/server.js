const express = require("express");
const cors = require("cors");
require('dotenv').config();
const sequelize = require("./config/db");
require("./models/User");
require("./models/Appointment");

const userRoutes = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();

// Parse allowed origins from environment variable
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      let isVercelPreview = false;
      try {
        isVercelPreview = /\.vercel\.app$/.test(new URL(origin).hostname);
      } catch (error) {
        isVercelPreview = false;
      }
      if (allowedOrigins.includes(origin) || isVercelPreview) {
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
      app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
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
  app.listen(PORT, () => console.log(`Server is running on port ${PORT} (DB offline)`));
};

startServer();
