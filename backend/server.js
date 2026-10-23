import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import riskZoneRoutes from "./routes/riskZoneRoutes.js";
import riskPredictRoutes from "./routes/riskPredictRoutes.js";
import incidentRoutes from "./routes/incidentRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import sensorRoutes from "./routes/sensorRoutes.js";
import roadRoutes from "./routes/roadRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import smsRoutes from "./routes/smsRoutes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/api/health", (req, res) => {
  res.json({ success: true, service: "Bhu-Drishti backend", status: "running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/risk-zones", riskZoneRoutes);
app.use("/api/risk", riskPredictRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/roads", roadRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/sms", smsRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Bhu-Drishti] Backend running on port ${PORT}`);
  });
});
