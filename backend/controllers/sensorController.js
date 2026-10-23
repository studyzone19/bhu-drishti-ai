import Sensor from "../models/Sensor.js";

function statusFor(type, value) {
  if (type === "soil_moisture") return value >= 75 ? "CRITICAL" : value >= 55 ? "HIGH" : "NORMAL";
  if (type === "rain_gauge") return value >= 100 ? "CRITICAL" : value >= 50 ? "HIGH" : "NORMAL";
  if (type === "ground_movement") return value >= 5 ? "CRITICAL" : value >= 2 ? "HIGH" : "NORMAL";
  if (type === "tilt_slope") return value >= 8 ? "CRITICAL" : value >= 4 ? "HIGH" : "NORMAL";
  return "NORMAL";
}

/** Ingests sensor data. Architecture supports real ESP32/IoT devices posting here later. */
export async function ingestSensorData(req, res, next) {
  try {
    const { sensorId, type, location, zone, value, unit, trend, isSimulated } = req.body;
    if (!sensorId || !type || value === undefined || !unit) {
      return res.status(400).json({ success: false, message: "sensorId, type, value and unit are required." });
    }
    const sensor = await Sensor.create({
      sensorId,
      type,
      location,
      zone,
      value,
      unit,
      trend: trend || "STABLE",
      status: statusFor(type, value),
      isSimulated: isSimulated !== undefined ? isSimulated : true,
      timestamp: new Date(),
    });
    res.status(201).json({ success: true, sensor });
  } catch (err) {
    next(err);
  }
}

export async function listSensors(req, res, next) {
  try {
    const { type, zone } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (zone) filter.zone = zone;
    const sensors = await Sensor.find(filter).sort({ timestamp: -1 }).limit(200);
    res.json({ success: true, count: sensors.length, sensors });
  } catch (err) {
    next(err);
  }
}
