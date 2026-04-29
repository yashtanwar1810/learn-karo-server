import { Router } from "express"
import { refreshAccessToken, signin, signout, signup, getProfile, updateProfile } from "../controllers/auth.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

export const authRouter = Router()

// public routes            
authRouter.post("/signup", signup)
authRouter.post("/signin", signin)

// protected routes
authRouter.get("/profile", authMiddleware, getProfile)
authRouter.put("/profile", authMiddleware, updateProfile)
authRouter.post("/logout", authMiddleware, signout)
authRouter.post("/refresh-token", refreshAccessToken)