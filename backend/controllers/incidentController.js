import Incident from "../models/Incident.js";

const severityByType = {
  Landslide: "CRITICAL",
  "Ground Crack": "HIGH",
  "Slope Movement": "HIGH",
  Rockfall: "HIGH",
  "Road Blockage": "MODERATE",
  "Flood-related slope failure": "CRITICAL",
  Other: "MODERATE",
};

/** Mock computer-vision inference layer. Clearly labeled as demo/mock. */
function mockImageAnalysis(type) {
  const detected = type === "Other" ? "Unclassified surface anomaly" : type;
  const severity = severityByType[type] || "MODERATE";
  const confidence = Math.round((0.7 + Math.random() * 0.25) * 100) / 100;
  return {
    detected,
    severity,
    confidence,
    isMockInference: true,
  };
}

export async function createIncident(req, res, next) {
  try {
    const { type, description, latitude, longitude, location, severity } = req.body;
    if (!type || !description || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "type, description, latitude and longitude are required.",
      });
    }

    const image = req.files?.image?.[0]?.filename || req.body.image || null;
    const video = req.files?.video?.[0]?.filename || req.body.video || null;

    const aiAnalysis = image ? mockImageAnalysis(type) : { detected: null, severity: null, confidence: null, isMockInference: true };

    const incident = await Incident.create({
      reportedBy: req.user._id,
      type,
      description,
      image,
      video,
      latitude,
      longitude,
      location,
      severity: severity || aiAnalysis.severity || "MODERATE",
      aiAnalysis,
    });

    res.status(201).json({ success: true, incident });
  } catch (err) {
    next(err);
  }
}

export async function listIncidents(req, res, next) {
  try {
    const { status, mine } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (mine === "true") filter.reportedBy = req.user._id;
    const incidents = await Incident.find(filter)
      .populate("reportedBy", "name email role")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: incidents.length, incidents });
  } catch (err) {
    next(err);
  }
}

export async function getIncident(req, res, next) {
  try {
    const incident = await Incident.findById(req.params.id).populate("reportedBy", "name email role");
    if (!incident) return res.status(404).json({ success: false, message: "Incident not found." });
    res.json({ success: true, incident });
  } catch (err) {
    next(err);
  }
}

export async function updateIncident(req, res, next) {
  try {
    const allowedStatuses = ["PENDING", "VERIFIED", "ASSIGNED", "ACTION_TAKEN", "RESOLVED"];
    if (req.body.status && !allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }
    const incident = await Incident.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!incident) return res.status(404).json({ success: false, message: "Incident not found." });
    res.json({ success: true, incident });
  } catch (err) {
    next(err);
  }
}
