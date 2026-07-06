import jwt from "jsonwebtoken";
import crypto from "crypto";

export const ACCESS_TOKEN_TTL = "15m";
export const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export const signAccessToken = (userId) =>
    jwt.sign({ userId, type: "access" }, process.env.JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_TTL,
    });

export const generateRefreshToken = () => crypto.randomBytes(64).toString("hex");

export const hashToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");