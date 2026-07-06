import express from "express";
import { signup, login, logout, onboard, refresh } from "../controllers/authController.js";
import { authUser } from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);

authRouter.post("/onboarding", authUser, onboard)
authRouter.get('/me', authUser, (req, res) => {
    res.status(200).json({ user: req.user })
})

export default authRouter;