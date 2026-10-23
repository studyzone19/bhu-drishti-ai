/**
 * Emergency Priority Engine.
 * Combines risk score, population affected, road importance, and incident
 * severity into a P1 / P2 / P3 emergency priority.
 */

const roadWeight = {
  "National Highway": 20,
  "State Highway": 12,
  "District Road": 5,
};

const severityWeight = {
  CRITICAL: 20,
  HIGH: 12,
  MODERATE: 6,
  LOW: 0,
};

export function computeEmergencyPriority({
  riskScore = 0,
  population = 0,
  roadImportance = "District Road",
  incidentSeverity = "LOW",
  distanceToSettlementKm = 10,
}) {
  const populationScore = Math.min(30, Math.round((population / 6000) * 30));
  const roadScore = roadWeight[roadImportance] ?? 5;
  const sevScore = severityWeight[incidentSeverity] ?? 0;
  const proximityScore = distanceToSettlementKm <= 2 ? 15 : distanceToSettlementKm <= 5 ? 8 : 0;

  const compositeScore = Math.round(
    riskScore * 0.45 + populationScore + roadScore * 0.6 + sevScore * 0.6 + proximityScore * 0.4
  );

  let priority = "P3";
  if (compositeScore >= 70) priority = "P1";
  else if (compositeScore >= 45) priority = "P2";

  return { priority, compositeScore };
}
