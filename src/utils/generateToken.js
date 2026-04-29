import jwt from "jsonwebtoken";
import { env } from "../config/env.config.js";

export const generateAccessToken = (id) => {
    return jwt.sign({ id }, env.JWT_SECRET, {
        expiresIn: "15m",
    });
};

export const generateRefreshToken = (id) => {
    return jwt.sign({ id }, env.JWT_SECRET, {
        expiresIn: "7d",
    });
};