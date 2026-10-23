import express from "express";
import { ingestSensorData, listSensors } from "../controllers/sensorController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/data", ingestSensorData);
router.get("/", protect, listSensors);

export default router;
