// library imports
import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"

// module imports
import { authRouter } from "./routes/auth.routes.js"

export const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser())
app.use(cors())

// api routes
app.get("/", (req, res) => res.json({message: "connected to backend!"}))

app.use("/api/v1/auth", authRouter)