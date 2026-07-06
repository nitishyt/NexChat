import validator from "validator";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { upsertStreamUser } from "../config/stream.js";
import {
    signAccessToken,
    generateRefreshToken,
    hashToken,
    REFRESH_TOKEN_TTL_MS,
} from "../utils/tokens.js";

const isProduction = process.env.NODE_ENV === "production";

const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/api/auth/refresh", // only ever sent to this one endpoint
    maxAge: REFRESH_TOKEN_TTL_MS,
};

// Issues a new access token, creates+stores a new refresh token (hashed),
// and sets the refresh cookie. Call this on signup, login, and refresh.
const issueTokens = async (res, user) => {
    const accessToken = signAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken();

    user.refreshTokens.push({
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    });
    // basic cleanup so this array doesn't grow forever across devices/logins
    if (user.refreshTokens.length > 5) {
        user.refreshTokens = user.refreshTokens.slice(-5);
    }
    await user.save();

    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
    return accessToken;
};

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Please enter a valid email address" })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User email already exists" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const idx = Math.floor(Math.random() * 1000) + 1
        const randomAvatar = `https://api.dicebear.com/10.x/avataaars/svg?backgroundColor=00bbff&accessoriesColor=262e33,65c9ff,5199e4,e6e6e6,929598,3c4f5c,b1e2ff,a7ffc4,ffdeb5,ffafb9,ffffb1,ff488e,ff5c5c,ffffff&clothesColor=262e33,5199e4,25557c,e6e6e6,929598,3c4f5c,b1e2ff,a7ffc4,ffafb9,ffffb1,ff5c5c,ffffff&borderRadius=50&${idx}`

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            image: randomAvatar,
            refreshTokens: [],
        })

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.image
            })
            console.log(`Stream user upserted successfully for ${newUser.fullName}`);
        } catch (error) {
            console.error(`Error upserting Stream user for ${newUser.fullName}:`, error);
        }

        const accessToken = await issueTokens(res, newUser);

        const safeUser = newUser.toObject();
        delete safeUser.password;
        delete safeUser.refreshTokens;

        res.status(201).json({ message: "User created successfully", user: safeUser, accessToken })

    } catch (err) {
        console.log("Error in signup controller", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        const accessToken = await issueTokens(res, user);
        const safeUser = await User.findById(user._id).select("-password -refreshTokens");

        res.status(200).json({ message: "User logged in successfully", user: safeUser, accessToken })

    } catch (err) {
        console.log("Error in login controller", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

// Called silently by the frontend whenever it needs a new access token —
// on app boot, or automatically after any request comes back 401.
export const refresh = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({ message: "No refresh token" });
        }

        const tokenHash = hashToken(token);
        const user = await User.findOne({ "refreshTokens.tokenHash": tokenHash });

        if (!user) {
            // Unknown token — possibly a reused/rotated-out token. Clear defensively.
            res.clearCookie("refreshToken", { ...REFRESH_COOKIE_OPTIONS, maxAge: undefined });
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        const stored = user.refreshTokens.find((rt) => rt.tokenHash === tokenHash);
        if (!stored || stored.expiresAt < new Date()) {
            user.refreshTokens = user.refreshTokens.filter((rt) => rt.tokenHash !== tokenHash);
            await user.save();
            return res.status(401).json({ message: "Refresh token expired" });
        }

        // Rotate: invalidate the used token, issue a brand new pair.
        user.refreshTokens = user.refreshTokens.filter((rt) => rt.tokenHash !== tokenHash);
        await user.save();

        const accessToken = await issueTokens(res, user);
        res.status(200).json({ accessToken });

    } catch (err) {
        console.log("Error in refresh controller", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (token) {
            const tokenHash = hashToken(token);
            await User.updateOne(
                { "refreshTokens.tokenHash": tokenHash },
                { $pull: { refreshTokens: { tokenHash } } }
            );
        }
    } catch (err) {
        console.log("Error revoking refresh token on logout", err);
    }

    res.clearCookie("refreshToken", { ...REFRESH_COOKIE_OPTIONS, maxAge: undefined });
    res.status(200).json({ message: "User logged out successfully" })
}

export const onboard = async (req, res) => {
    try {
        const userId = req.user._id
        const { fullName, bio, skill, language, location } = req.body
        if (!fullName || !bio || !skill || !language || !location) {
            return res.status(400).json({
                message: "Please fill all the fields",
                missingFields:
                    [!fullName && "fullName",
                    !bio && "bio",
                    !skill && "skill",
                    !language && "language",
                    !location && "location"
                    ].filter(Boolean)
            })
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true
        }, { new: true }).select("-password -refreshTokens")

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" })
        }

        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.image
            })
            console.log(`Stream user updated successfully for ${updatedUser.fullName}`);
        } catch (error) {
            console.error(`Error updating Stream user for ${updatedUser.fullName}:`, error);
        }

        res.status(200).json({ message: "User onboarded successfully", user: updatedUser })
    } catch (err) {
        console.log("Error in onboard controller", err)
        res.status(500).json({ message: "Internal server error" })
    }
}