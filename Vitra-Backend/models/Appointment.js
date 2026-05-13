const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Appointment = sequelize.define("Appointment", {
  patientUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  patientName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  patientEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  patientPhone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  doctorUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  doctorName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  doctorEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  scheduledAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  callDurationMinutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 60,
  },
  callExtendedMinutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  healthDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  reportNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imageAttachment: {
    type: DataTypes.TEXT("long"),
    allowNull: true,
  },
  reportAttachment: {
    type: DataTypes.TEXT("long"),
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "PENDING",
  },
});

module.exports = Appointment;
