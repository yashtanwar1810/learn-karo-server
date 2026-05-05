// library imports
import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"

// module imports
import { env } from "./config/env.config.js"
import { authRouter } from "./routes/auth.routes.js"
import { documentRouter } from "./routes/document.routes.js"

export const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use("/uploads", express.static("uploads"))
app.use(cookieParser())
app.use(cors({
    origin: env.ALLOWED_ORIGINS,
    credentials: true
}))

// api routes
app.get("/", (req, res) => res.json({ message: "connected to backend!" }))

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/documents", documentRouter)