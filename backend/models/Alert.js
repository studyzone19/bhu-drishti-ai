import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    zone: { type: mongoose.Schema.Types.ObjectId, ref: "RiskZone", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    riskScore: { type: Number, required: true },
    riskLevel: { type: String, enum: ["HIGH", "CRITICAL"], required: true },
    mainFactors: [{ type: String }],
    recommendedAction: { type: String, required: true },
    affectedArea: { type: String },
    recipients: [{ type: String, enum: ["admin", "field_officer", "citizen"] }],
    status: { type: String, enum: ["ACTIVE", "RESOLVED"], default: "ACTIVE" },
    notificationsSent: {
      inApp: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      email: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Alert", alertSchema);
