import mongoose from "mongoose";

const roadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    state: { type: String },
    status: {
      type: String,
      enum: ["OPEN", "AT_RISK", "BLOCKED", "UNDER_RESTORATION"],
      default: "OPEN",
    },
    riskLevel: { type: String, enum: ["LOW", "MODERATE", "HIGH", "CRITICAL"], default: "LOW" },
    blockageReason: { type: String, default: "" },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    importance: { type: String, enum: ["National Highway", "State Highway", "District Road"], default: "District Road" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Road", roadSchema);
