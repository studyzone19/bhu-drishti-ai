import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema(
  {
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "Landslide",
        "Ground Crack",
        "Slope Movement",
        "Rockfall",
        "Road Blockage",
        "Flood-related slope failure",
        "Other",
      ],
      required: true,
    },
    description: { type: String, required: true },
    image: { type: String },
    video: { type: String },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    location: { type: String },
    severity: {
      type: String,
      enum: ["LOW", "MODERATE", "HIGH", "CRITICAL"],
      default: "MODERATE",
    },
    status: {
      type: String,
      enum: ["PENDING", "VERIFIED", "ASSIGNED", "ACTION_TAKEN", "RESOLVED"],
      default: "PENDING",
    },
    aiAnalysis: {
      detected: { type: String, default: null },
      severity: { type: String, default: null },
      confidence: { type: Number, default: null },
      isMockInference: { type: Boolean, default: true },
    },
    riskZone: { type: mongoose.Schema.Types.ObjectId, ref: "RiskZone" },
  },
  { timestamps: true }
);

export default mongoose.model("Incident", incidentSchema);
