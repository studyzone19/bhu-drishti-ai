import FieldTask from "../models/FieldTask.js";
import { computeEmergencyPriority } from "../services/priorityEngine.js";

export async function listTasks(req, res, next) {
  try {
    const { assignedTo, status } = req.query;
    const filter = {};
    if (assignedTo) filter.assignedTo = assignedTo;
    else if (req.user.role === "field_officer") filter.assignedTo = req.user._id;
    if (status) filter.status = status;
    const tasks = await FieldTask.find(filter)
      .populate("incident")
      .populate("zone")
      .populate("assignedTo", "name email")
      .sort({ priority: 1, createdAt: -1 });
    res.json({ success: true, count: tasks.length, tasks });
  } catch (err) {
    next(err);
  }
}

export async function createTask(req, res, next) {
  try {
    const { riskScore, population, roadImportance, incidentSeverity, distanceToSettlementKm } = req.body;
    let priority = req.body.priority;

    if (!priority) {
      const result = computeEmergencyPriority({
        riskScore,
        population,
        roadImportance,
        incidentSeverity,
        distanceToSettlementKm,
      });
      priority = result.priority;
    }

    const task = await FieldTask.create({ ...req.body, priority, riskScore });
    res.status(201).json({ success: true, task });
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req, res, next) {
  try {
    const update = { ...req.body };
    if (update.status === "COMPLETED") update.completedAt = new Date();
    const task = await FieldTask.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ success: false, message: "Task not found." });
    res.json({ success: true, task });
  } catch (err) {
    next(err);
  }
}
