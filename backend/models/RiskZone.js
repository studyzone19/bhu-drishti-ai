import mongoose from "mongoose";

const riskZoneSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    district: { type: String, required: true },
    state: {
      type: String,
      required: true,
      enum: [
        "Assam",
        "Arunachal Pradesh",
        "Meghalaya",
        "Manipur",
        "Mizoram",
        "Nagaland",
        "Tripura",
        "Sikkim",
      ],
    },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },

    // Environmental inputs
    rainfall24h: { type: Number, default: 0 },
    rainfall72h: { type: Number, default: 0 },
    soilMoisture: { type: Number, default: 0 },
    slope: { type: Number, default: 0 },
    elevation: { type: Number, default: 0 },
    historicalLandslides: { type: Number, default: 0 },
    landCover: { type: String, default: "forest" },
    distanceFromRoad: { type: Number, default: 0 },
    distanceFromRiver: { type: Number, default: 0 },

    // Computed outputs
    riskScore: { type: Number, default: 0, min: 0, max: 100 },
    riskLevel: {
      type: String,
      enum: ["LOW", "MODERATE", "HIGH", "CRITICAL"],
      default: "LOW",
    },
    probability: { type: Number, default: 0 },
    recommendedAction: { type: String, default: "" },
    predictionSource: {
      type: String,
      enum: ["rule_engine", "ml_service"],
      default: "rule_engine",
    },

    priority: { type: String, enum: ["P1", "P2", "P3", null], default: null },
    population: { type: Number, default: 0 },
    roadStatus: {
      type: String,
      enum: ["OPEN", "AT_RISK", "BLOCKED", "UNDER_RESTORATION"],
      default: "OPEN",
    },
    notes: { type: String, default: "" },
    isDemoData: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("RiskZone", riskZoneSchema);
