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

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Connected to Aiven MySQL");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("Models synced with MySQL");
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => {
    console.log("DB/Sync error:", err);
    process.exit(1);
  });
