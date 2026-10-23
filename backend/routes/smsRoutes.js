import express from "express";
import { broadcastZoneAlert, sendViaFast2SMS, formatPhoneNumber } from "../services/smsService.js";

const router = express.Router();

/**
 * GET /api/sms/config
 * Returns whether real SMS gateway is configured in backend environment
 */
router.get("/config", (req, res) => {
  const hasKey = Boolean(process.env.FAST2SMS_API_KEY && process.env.FAST2SMS_API_KEY.trim() !== "");
  res.json({
    hasEnvKey: hasKey,
    gateway: "Fast2SMS (India Bulk SMS API)",
    supportedFormat: "10-digit Indian mobile numbers (e.g. 9876543210)",
    freeTierUrl: "https://www.fast2sms.com",
  });
});

/**
 * POST /api/sms/send-broadcast
 * Body: { message, zoneIds, customNumbers, apiKey }
 */
router.post("/send-broadcast", async (req, res) => {
  try {
    const { message, zoneIds = [], customNumbers = [], apiKey } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "SMS message text is required." });
    }

    const result = await broadcastZoneAlert({
      zoneIds,
      customNumbers,
      message,
      apiKey,
    });

    res.json(result);
  } catch (err) {
    console.error("[SMS Broadcast Error]", err);
    res.status(500).json({
      success: false,
      message: "Internal server error while sending SMS",
      error: err.message,
    });
  }
});

/**
 * POST /api/sms/send-test
 * Quick endpoint to send a single test SMS to a phone number
 * Body: { phone, message, apiKey }
 */
router.post("/send-test", async (req, res) => {
  try {
    const { phone, message, apiKey } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: "Phone number is required." });
    }

    const valid = formatPhoneNumber(phone);
    if (!valid) {
      return res.status(400).json({ success: false, message: "Please provide a valid 10-digit Indian phone number." });
    }

    const result = await sendViaFast2SMS({
      message: message || "⚠️ Bhu-Drishti AI Early Warning: Test SMS Alert to your mobile phone. System is active.",
      numbers: [valid],
      apiKey,
    });

    res.json(result);
  } catch (err) {
    console.error("[SMS Test Error]", err);
    res.status(500).json({ success: false, message: "Error sending test SMS", error: err.message });
  }
});

export default router;
