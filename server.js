import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRoutes } from "./routes/auth.route.js";
import { connectDB } from "./lib/connectDB.js";
import { adminRoutes } from "./routes/admin.route.js";
import { userRoutes } from "./routes/user.route.js";
import { bookingRoutes } from "./routes/booking.route.js";
import { generalLimiter } from "./lib/helper.js";
import { swaggerUI, swaggerSpec } from "./config/swagger.js";

const app = express();

app.use(express.json());
app.use(cookieParser())

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

dotenv.config();

connectDB()

app.use("/api/auth", authRoutes)
app.use("/api/user", generalLimiter, userRoutes)
app.use("/api/admin", generalLimiter, adminRoutes)
app.use("/api/booking", generalLimiter, bookingRoutes)

// swagger 
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is live" });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`)
})