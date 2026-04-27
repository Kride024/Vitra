const express = require("express");
const router = express.Router();

const { login, register, getMyProfile, getDoctors } = require("../controller/userController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/login", login);

 //POST - create user

router.post("/register", register);

router.get("/me", authMiddleware, getMyProfile);
router.get("/doctors", authMiddleware, getDoctors);


module.exports = router;
