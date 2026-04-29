import dotenv from "dotenv"

dotenv.config()

export const env = {
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret_key",
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/learnify",
    NODE_ENV: process.env.NODE_ENV || "development",

    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : ["http://localhost:3000"],
}