/**
 * Rule-based Risk Score Engine.
 * This is the fallback/baseline engine used when the ML service is unavailable,
 * and also used to validate/cross-check ML predictions.
 * Score range: 0-100.
 */

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function classifyRisk(score) {
  if (score >= 71) return "CRITICAL";
  if (score >= 51) return "HIGH";
  if (score >= 31) return "MODERATE";
  return "LOW";
}

export function recommendedActionFor(level) {
  switch (level) {
    case "CRITICAL":
      return "Immediate field inspection and warning. Restrict access to vulnerable road sections and alert nearby communities.";
    case "HIGH":
      return "Schedule urgent field verification within 24 hours. Monitor rainfall and soil moisture closely.";
    case "MODERATE":
      return "Continue routine monitoring. Re-check after next rainfall update.";
    default:
      return "No immediate action required. Continue passive monitoring.";
  }
}

export function computeRiskScore(input) {
  const {
    rainfall24h = 0,
    rainfall72h = 0,
    soilMoisture = 0,
    slope = 0,
    elevation = 0,
    historicalLandslides = 0,
    distanceFromRoad = 1000,
    distanceFromRiver = 1000,
  } = input;

  // Weighted contribution model (0-100 scale), tuned for demo purposes.
  const rainfallScore = clamp((rainfall24h / 200) * 30 + (rainfall72h / 400) * 20, 0, 35);
  const soilScore = clamp((soilMoisture / 100) * 20, 0, 20);
  const slopeScore = clamp((slope / 60) * 20, 0, 20);
  const historyScore = clamp(historicalLandslides * 3, 0, 15);
  const proximityScore = clamp(
    (distanceFromRiver < 300 ? 5 : 0) + (distanceFromRoad < 200 ? 5 : 0),
    0,
    10
  );
  // Very high elevation with steep slope compounds risk slightly.
  const elevationFactor = elevation > 1000 && slope > 25 ? 5 : 0;

  const rawScore =
    rainfallScore + soilScore + slopeScore + historyScore + proximityScore + elevationFactor;

  const riskScore = Math.round(clamp(rawScore, 0, 100));
  const riskLevel = classifyRisk(riskScore);
  const probability = Math.round((riskScore / 100) * 100) / 100;

  return {
    riskScore,
    riskLevel,
    probability,
    recommendedAction: recommendedActionFor(riskLevel),
    predictionSource: "rule_engine",
  };
}
