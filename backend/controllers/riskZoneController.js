import RiskZone from "../models/RiskZone.js";
import { getRiskPrediction } from "../services/mlService.js";
import { maybeCreateAlert } from "../services/alertEngine.js";

export async function listRiskZones(req, res, next) {
  try {
    const { state, riskLevel } = req.query;
    const filter = {};
    if (state) filter.state = state;
    if (riskLevel) filter.riskLevel = riskLevel;
    const zones = await RiskZone.find(filter).sort({ riskScore: -1 });
    res.json({ success: true, count: zones.length, zones });
  } catch (err) {
    next(err);
  }
}

export async function getRiskZone(req, res, next) {
  try {
    const zone = await RiskZone.findById(req.params.id);
    if (!zone) return res.status(404).json({ success: false, message: "Risk zone not found." });
    res.json({ success: true, zone });
  } catch (err) {
    next(err);
  }
}

export async function createRiskZone(req, res, next) {
  try {
    const zone = await RiskZone.create(req.body);
    res.status(201).json({ success: true, zone });
  } catch (err) {
    next(err);
  }
}

export async function updateRiskZone(req, res, next) {
  try {
    const zone = await RiskZone.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!zone) return res.status(404).json({ success: false, message: "Risk zone not found." });
    res.json({ success: true, zone });
  } catch (err) {
    next(err);
  }
}

export async function deleteRiskZone(req, res, next) {
  try {
    const zone = await RiskZone.findByIdAndDelete(req.params.id);
    if (!zone) return res.status(404).json({ success: false, message: "Risk zone not found." });
    res.json({ success: true, message: "Risk zone deleted." });
  } catch (err) {
    next(err);
  }
}

/**
 * Runs a prediction (ML service, with rule-engine fallback) against a zone's
 * current environmental inputs, persists the result, and raises an alert
 * if the risk crosses the HIGH/CRITICAL threshold.
 */
export async function predictRiskForZone(req, res, next) {
  try {
    const zone = await RiskZone.findById(req.params.id);
    if (!zone) return res.status(404).json({ success: false, message: "Risk zone not found." });

    const input = {
      rainfall24h: zone.rainfall24h,
      rainfall72h: zone.rainfall72h,
      soilMoisture: zone.soilMoisture,
      slope: zone.slope,
      elevation: zone.elevation,
      historicalLandslides: zone.historicalLandslides,
      distanceFromRoad: zone.distanceFromRoad,
      distanceFromRiver: zone.distanceFromRiver,
    };

    const prediction = await getRiskPrediction(input);

    zone.riskScore = prediction.riskScore;
    zone.riskLevel = prediction.riskLevel;
    zone.probability = prediction.probability;
    zone.recommendedAction = prediction.recommendedAction;
    zone.predictionSource = prediction.predictionSource;
    await zone.save();

    const alert = await maybeCreateAlert(zone);

    res.json({
      success: true,
      zone,
      prediction,
      alertCreated: Boolean(alert),
      alert,
    });
  } catch (err) {
    next(err);
  }
}

/** Ad-hoc prediction without persisting to a zone - used for the "what-if" demo panel. */
export async function predictRiskAdHoc(req, res, next) {
  try {
    const prediction = await getRiskPrediction(req.body);
    res.json({ success: true, prediction });
  } catch (err) {
    next(err);
  }
}
