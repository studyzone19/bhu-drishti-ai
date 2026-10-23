import express from "express";
import { overview, publicSummary, riskAnalytics, incidentAnalytics } from "../controllers/analyticsController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/overview", protect, overview);
router.get("/public-summary", publicSummary);
router.get("/risk", protect, riskAnalytics);
router.get("/incidents", protect, incidentAnalytics);

export default router;
