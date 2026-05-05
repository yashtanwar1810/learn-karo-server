import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import { env } from "../config/env.config.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";

const cookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
};

// REGISTER
export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashed,
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res
        .cookie("refreshToken", refreshToken, cookieOptions)
        .status(201)
        .json({
            _id: user._id,
            name: user.name,
            email: user.email,
            accessToken,
        });
};

// LOGIN
export const signin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json({
            accessToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
};

// REFRESH TOKEN
export const refreshAccessToken = async (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        return res.status(401).json({ message: "No refresh token" });
    }

    try {
        const decoded = jwt.verify(token, env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = generateAccessToken(user._id);

        res.json({ accessToken: newAccessToken });
    } catch (err) {
        return res.status(403).json({ message: "Token expired or invalid" });
    }
};

// LOGOUT
export const signout = async (req, res) => {
    const token = req.cookies.refreshToken;

    if (token) {
        const user = await User.findOne({ refreshToken: token });
        if (user) {
            user.refreshToken = null;
            await user.save();
        }
    }

    res.clearCookie("refreshToken").json({ message: "Logged out" });
};

// @desc    Get logged-in user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
    try {
        // req.user.id comes from access token middleware
        const user = await User.findById(req.user.id).select(
            "-password -refreshToken"
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Update logged-in user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update fields (only if provided)
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // Optional: update password
        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            message: "Profile updated successfully",
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
};