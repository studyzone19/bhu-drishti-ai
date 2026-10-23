import express from "express";
import {
  createIncident,
  listIncidents,
  getIncident,
  updateIncident,
} from "../controllers/incidentController.js";
import { protect, authorize } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/",
  protect,
  upload.fields([{ name: "image", maxCount: 1 }, { name: "video", maxCount: 1 }]),
  createIncident
);
router.get("/", protect, listIncidents);
router.get("/:id", protect, getIncident);
router.put("/:id", protect, authorize("admin", "field_officer"), updateIncident);

export default router;
