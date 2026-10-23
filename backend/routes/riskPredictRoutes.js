import express from "express";
import { predictRiskAdHoc } from "../controllers/riskZoneController.js";

const router = express.Router();

// POST /api/risk/predict - ad-hoc prediction, matches spec section 25
router.post("/predict", predictRiskAdHoc);

// POST /api/risk/chat - AI chatbot proxy to ML service
router.post("/chat", async (req, res) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ reply: "AI service is currently processing. Please try again in a moment.", status: "error" });
  }
});

export default router;
