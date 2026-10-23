import express from "express";
import { listRoads, createRoad, updateRoad } from "../controllers/roadController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", listRoads);
router.post("/", protect, authorize("admin"), createRoad);
router.put("/:id", protect, authorize("admin", "field_officer"), updateRoad);

export default router;
