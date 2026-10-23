import Alert from "../models/Alert.js";
import RiskZone from "../models/RiskZone.js";

export async function listPublicAlerts(req, res, next) {
  try {
    const alerts = await Alert.find({ status: "ACTIVE" })
      .populate("zone")
      .sort({ createdAt: -1 })
      .limit(50);
    if (alerts.length > 0) {
      return res.json({ success: true, count: alerts.length, alerts });
    }

    const zones = await RiskZone.find({ riskLevel: { $in: ["HIGH", "CRITICAL"] } })
      .sort({ riskScore: -1 })
      .limit(20);
    const zoneAlerts = zones.map((zone) => ({
      _id: `zone-${zone._id}`,
      title: `${zone.riskLevel} landslide risk near ${zone.name}`,
      message: `Landslide risk is currently ${zone.riskLevel.toLowerCase()} in ${zone.district}, ${zone.state}. Please avoid unsafe slopes and follow local authority guidance.`,
      riskScore: zone.riskScore,
      riskLevel: zone.riskLevel,
      recommendedAction: zone.recommendedAction || "Stay alert, avoid the affected area and follow official instructions.",
      affectedArea: `${zone.district}, ${zone.state}`,
      zone,
    }));
    res.json({ success: true, count: zoneAlerts.length, alerts: zoneAlerts });
  } catch (err) {
    next(err);
  }
}

export async function listAlerts(req, res, next) {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const alerts = await Alert.find(filter).populate("zone").sort({ createdAt: -1 });
    res.json({ success: true, count: alerts.length, alerts });
  } catch (err) {
    next(err);
  }
}

export async function createAlert(req, res, next) {
  try {
    const alert = await Alert.create(req.body);
    res.status(201).json({ success: true, alert });
  } catch (err) {
    next(err);
  }
}

export async function updateAlert(req, res, next) {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!alert) return res.status(404).json({ success: false, message: "Alert not found." });
    res.json({ success: true, alert });
  } catch (err) {
    next(err);
  }
}
