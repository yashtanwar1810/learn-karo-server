import { app } from "./src/app.js";
import { env } from "./src/config/env.config.js"
import { connectDB } from "./src/config/db.config.js"

await connectDB()

app.listen(env.PORT, () => console.log("running..."))
