import axios from "axios";
import { computeRiskScore } from "./riskEngine.js";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

/**
 * Calls the Python FastAPI ML service for a risk prediction.
 * Falls back to the rule-based engine (clearly labeled) if the ML
 * service is unreachable, per the "no silent fake predictions" rule.
 */
export async function getRiskPrediction(input) {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/predict-risk`, input, {
      timeout: 4000,
    });
    return {
      ...response.data,
      predictionSource: "ml_service",
      mlServiceAvailable: true,
    };
  } catch (err) {
    const fallback = computeRiskScore(input);
    return {
      ...fallback,
      mlServiceAvailable: false,
      warning:
        "ML prediction service currently unavailable. Showing rule-engine estimate instead of a machine-learning prediction.",
    };
  }
}
