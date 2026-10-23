import Alert from "../models/Alert.js";

function buildFactors(zone) {
  const factors = [];
  if (zone.rainfall24h >= 100) factors.push("Heavy rainfall in last 24 hours");
  if (zone.soilMoisture >= 70) factors.push("High soil moisture saturation");
  if (zone.slope >= 30) factors.push("Steep slope gradient");
  if (zone.historicalLandslides >= 3) factors.push("History of repeated landslides in this zone");
  if (factors.length === 0) factors.push("Composite environmental risk indicators");
  return factors;
}

/**
 * Generates an Alert document when a zone crosses the HIGH/CRITICAL threshold.
 * Avoids duplicate active alerts for the same zone.
 */
export async function maybeCreateAlert(zone) {
  if (zone.riskScore < 51) return null;

  const existing = await Alert.findOne({ zone: zone._id, status: "ACTIVE" });
  if (existing) {
    existing.riskScore = zone.riskScore;
    existing.riskLevel = zone.riskLevel;
    existing.mainFactors = buildFactors(zone);
    existing.recommendedAction = zone.recommendedAction;
    await existing.save();
    return existing;
  }

  const riskLevel = zone.riskScore >= 71 ? "CRITICAL" : "HIGH";
  const alert = await Alert.create({
    zone: zone._id,
    title: `${riskLevel} LANDSLIDE WARNING`,
    message: `${zone.name}, ${zone.district}, ${zone.state} has reached a risk score of ${zone.riskScore}/100 (${riskLevel}).`,
    riskScore: zone.riskScore,
    riskLevel,
    mainFactors: buildFactors(zone),
    recommendedAction: zone.recommendedAction,
    affectedArea: `${zone.name}, ${zone.district}`,
    recipients: ["admin", "field_officer", "citizen"],
  });
  return alert;
}
