const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ChatMessage = sequelize.define(
  "ChatMessage",
  {
    appointmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    senderUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    senderRole: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senderName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    indexes: [{ fields: ["appointmentId"] }],
  }
);

module.exports = ChatMessage;