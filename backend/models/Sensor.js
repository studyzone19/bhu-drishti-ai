import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema(
  {
    sensorId: { type: String, required: true },
    type: {
      type: String,
      enum: ["soil_moisture", "rain_gauge", "ground_movement", "tilt_slope"],
      required: true,
    },
    location: {
      name: String,
      latitude: Number,
      longitude: Number,
    },
    zone: { type: mongoose.Schema.Types.ObjectId, ref: "RiskZone" },
    value: { type: Number, required: true },
    unit: { type: String, required: true },
    status: { type: String, enum: ["NORMAL", "HIGH", "CRITICAL"], default: "NORMAL" },
    trend: { type: String, enum: ["INCREASING", "STABLE", "DECREASING"], default: "STABLE" },
    isSimulated: { type: Boolean, default: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Sensor", sensorSchema);
