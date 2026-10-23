import RiskZone from "../models/RiskZone.js";
import Incident from "../models/Incident.js";
import Alert from "../models/Alert.js";
import Road from "../models/Road.js";
import Sensor from "../models/Sensor.js";

export async function publicSummary(req, res, next) {
  try {
    const [zones, sensors] = await Promise.all([RiskZone.find(), Sensor.find()]);
    const districts = new Set(zones.map((zone) => zone.district).filter(Boolean));
    const population = zones.reduce((total, zone) => total + (zone.population || 0), 0);

    res.json({
      success: true,
      data: {
        weatherStations: sensors.filter((sensor) => sensor.type === "rain_gauge").length,
        sensorFeeds: sensors.length,
        monitoredDistricts: districts.size,
        peopleSafer: population,
      },
    });
  } catch (err) {
    next(err);
  }
}


export async function overview(req, res, next) {
  try {
    const [zones, incidents, alerts, roads] = await Promise.all([
      RiskZone.find(),
      Incident.find(),
      Alert.find({ status: "ACTIVE" }),
      Road.find(),
    ]);
          
    
    const riskCounts = { LOW: 0, MODERATE: 0, HIGH: 0, CRITICAL: 0 };
    zones.forEach((z) => (riskCounts[z.riskLevel] = (riskCounts[z.riskLevel] || 0) + 1));

    res.json({
      success: true,
      data: {
        totalZones: zones.length,
        riskCounts,
        activeAlerts: alerts.length,
        pendingReports: incidents.filter((i) => i.status === "PENDING").length,
        blockedRoads: roads.filter((r) => r.status === "BLOCKED").length,
        atRiskRoads: roads.filter((r) => r.status === "AT_RISK").length,
        totalIncidents: incidents.length,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function riskAnalytics(req, res, next) {
  try {
    const zones = await RiskZone.find();
    const byDistrict = {};
    zones.forEach((z) => {
      byDistrict[z.district] = byDistrict[z.district] || { LOW: 0, MODERATE: 0, HIGH: 0, CRITICAL: 0 };
      byDistrict[z.district][z.riskLevel] += 1;
    });
    const rainfallVsRisk = zones.map((z) => ({
      name: z.name,
      rainfall24h: z.rainfall24h,
      riskScore: z.riskScore,
    }));
    res.json({ success: true, byDistrict, rainfallVsRisk });
  } catch (err) {
    next(err);
  }
}

export async function incidentAnalytics(req, res, next) {
  try {
    const incidents = await Incident.find();
    const byMonth = {};
    incidents.forEach((i) => {
      const key = `${i.createdAt.getFullYear()}-${String(i.createdAt.getMonth() + 1).padStart(2, "0")}`;
      byMonth[key] = (byMonth[key] || 0) + 1;
    });
    const byType = {};
    incidents.forEach((i) => (byType[i.type] = (byType[i.type] || 0) + 1));

    const resolved = incidents.filter((i) => i.status === "RESOLVED");
    const avgResolutionHours =
      resolved.length > 0
        ? Math.round(
            resolved.reduce((sum, i) => sum + (i.updatedAt - i.createdAt) / 36e5, 0) / resolved.length
          )
        : null;
 
    res.json({ success: true, byMonth, byType, avgResolutionHours, totalResolved: resolved.length });
  } catch (err) {
    next(err);
  }
}
