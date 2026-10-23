import Road from "../models/Road.js";

export async function listRoads(req, res, next) {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const roads = await Road.find(filter).sort({ updatedAt: -1 });
    res.json({ success: true, count: roads.length, roads });
  } catch (err) {
    next(err);
  }
}

export async function createRoad(req, res, next) {
  try {
    const road = await Road.create(req.body);
    res.status(201).json({ success: true, road });
  } catch (err) {
    next(err);
  }
}

export async function updateRoad(req, res, next) {
  try {
    const allowedStatuses = ["OPEN", "AT_RISK", "BLOCKED", "UNDER_RESTORATION"];
    if (req.body.status && !allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ success: false, message: "Invalid road status." });
    }
    const road = await Road.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user._id },
      { new: true, runValidators: true }
    );
    if (!road) return res.status(404).json({ success: false, message: "Road not found." });
    res.json({ success: true, road });
  } catch (err) {
    next(err);
  }
}
