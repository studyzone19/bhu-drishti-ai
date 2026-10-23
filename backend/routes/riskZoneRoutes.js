import express from "express";
import {
  listRiskZones,
  getRiskZone,
  createRiskZone,
  updateRiskZone,
  deleteRiskZone,
  predictRiskForZone,
  predictRiskAdHoc,
} from "../controllers/riskZoneController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", listRiskZones);
router.get("/:id", getRiskZone);
router.post("/", protect, authorize("admin"), createRiskZone);
router.put("/:id", protect, authorize("admin"), updateRiskZone);
router.delete("/:id", protect, authorize("admin"), deleteRiskZone);
router.post("/:id/predict", protect, authorize("admin", "field_officer"), predictRiskForZone);

export default router;
