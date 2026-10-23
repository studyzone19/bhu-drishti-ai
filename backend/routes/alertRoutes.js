import express from "express";
import { listAlerts, listPublicAlerts, createAlert, updateAlert } from "../controllers/alertController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/public", listPublicAlerts);
router.get("/", protect, listAlerts);
router.post("/", protect, authorize("admin"), createAlert);
router.put("/:id", protect, authorize("admin"), updateAlert);

export default router;
