const express = require("express");
const { registerUser, loginUser, verifyUser } = require("../controllers/user.controller");
const { auth } = require("../middleware/auth.middleware");
const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/verify", auth, verifyUser)

module.exports = { userRouter };