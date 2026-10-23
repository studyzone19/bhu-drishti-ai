import mongoose from "mongoose";

const fieldTaskSchema = new mongoose.Schema(
  {
    incident: { type: mongoose.Schema.Types.ObjectId, ref: "Incident" },
    zone: { type: mongoose.Schema.Types.ObjectId, ref: "RiskZone" },
    title: { type: String, required: true },
    taskType: {
      type: String,
      enum: ["Verify landslide", "Inspect slope", "Check road", "Verify citizen report", "Upload evidence"],
      required: true,
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    priority: { type: String, enum: ["P1", "P2", "P3"], default: "P3" },
    riskScore: { type: Number, default: 0 },
    location: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    deadline: { type: Date },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "IN_PROGRESS", "COMPLETED"],
      default: "PENDING",
    },
    notes: [{ type: String }],
    evidence: [{ type: String }],
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("FieldTask", fieldTaskSchema);
