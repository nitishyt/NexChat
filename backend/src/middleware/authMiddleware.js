import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized no token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || decoded.type !== "access") {
            return res.status(401).json({ message: "Unauthorized invalid token" });
        }

        const user = await User.findById(decoded.userId).select("-password -refreshTokens");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized user not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized invalid or expired token" });
    }
};