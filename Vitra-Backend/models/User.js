const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User",{
    firstName:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    lastName:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    phone:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    email:{
        type: DataTypes.STRING,
        allowNull:false,
        unique: true,
    },
    password:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    role:{
        type: DataTypes.STRING,
        defaultValue: "PATIENT",
    },
    specialty: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    experienceYears: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    consultationFee: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true,
    },
    availability: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profileImageUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    rating: {
        type: DataTypes.DECIMAL(3,1),
        allowNull: true,
        defaultValue: 4.5,
    }

});
module.exports = User;