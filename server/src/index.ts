import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import accountRoutes from "./routes/accountRoutes";
import authRoutes from "./routes/authRoutes";
import courseRoutes from "./routes/courseRoutes";
import curriculumRoutes from "./routes/curriculumRoutes";
import scheduleRoutes from "./routes/scheduleRoutes";
import authenticateToken from "./middlewares/authenticateToken";

dotenv.config();

const PORT = process.env.PORT || 5100;
const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRoutes);

app.use("/api/account", authenticateToken, accountRoutes);
app.use("/api/course", authenticateToken, courseRoutes);
app.use("/api/curriculum", authenticateToken, curriculumRoutes);
app.use("/api/schedule", authenticateToken, scheduleRoutes);

app.get("/protected-route", authenticateToken, (req, res) => {
  res.json({
    message: "You accessed a protected route",
    user: (req as any).user,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port: ${PORT}`);
});
