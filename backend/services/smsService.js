import axios from "axios";
import User from "../models/User.js";
import RiskZone from "../models/RiskZone.js";

/**
 * Format Indian phone numbers into 10-digit numbers for Fast2SMS
 */
export function formatPhoneNumber(phone) {
  if (!phone) return null;
  // Remove non-digit characters
  const cleaned = phone.toString().replace(/\D/g, "");
  // If it starts with 91 and has 12 digits, strip 91
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return cleaned.slice(2);
  }
  // If it starts with 0 and has 11 digits, strip 0
  if (cleaned.length === 11 && cleaned.startsWith("0")) {
    return cleaned.slice(1);
  }
  // Valid 10 digit number
  if (cleaned.length === 10) {
    return cleaned;
  }
  return null;
}

/**
 * Send real SMS using Fast2SMS Gateway
 * @param {Object} options
 * @param {string} options.message - Message body
 * @param {string[]} options.numbers - Array of 10-digit mobile numbers
 * @param {string} [options.apiKey] - Optional custom Fast2SMS API key
 */
export async function sendViaFast2SMS({ message, numbers, apiKey }) {
  const key = apiKey || process.env.FAST2SMS_API_KEY;

  if (!key) {
    return {
      success: false,
      isSimulated: true,
      reason: "NO_API_KEY",
      message: "No Fast2SMS API key configured. Provide an API key to send real SMS.",
      numbers,
    };
  }

  // Filter valid numbers
  const validNumbers = numbers
    .map(formatPhoneNumber)
    .filter(Boolean);

  if (validNumbers.length === 0) {
    return {
      success: false,
      reason: "NO_VALID_NUMBERS",
      message: "No valid 10-digit Indian mobile numbers provided.",
    };
  }

  const numbersString = Array.from(new Set(validNumbers)).join(",");

  try {
    const payload = {
      route: "q",
      message: message.trim(),
      language: "english",
      flash: 0,
      numbers: numbersString,
    };

    const response = await axios.post("https://www.fast2sms.com/dev/bulkV2", payload, {
      headers: {
        authorization: key.trim(),
        "Content-Type": "application/json",
      },
      timeout: 15000,
    });

    const data = response.data;
    if (data.return === true || data.status_code === 200) {
      return {
        success: true,
        isSimulated: false,
        requestId: data.request_id || "F2S_" + Date.now(),
        message: data.message ? data.message[0] : "SMS sent successfully",
        recipientCount: validNumbers.length,
        recipients: validNumbers,
      };
    } else {
      return {
        success: false,
        isSimulated: false,
        message: data.message ? (Array.isArray(data.message) ? data.message.join(", ") : data.message) : "Failed to deliver SMS",
        raw: data,
      };
    }
  } catch (err) {
    const errorMsg =
      err.response?.data?.message ||
      err.response?.data ||
      err.message ||
      "Error connecting to SMS Gateway";

    const errorString = typeof errorMsg === "object" ? JSON.stringify(errorMsg) : String(errorMsg);
    const isVerificationNeeded = errorString.includes("100 INR") || errorString.includes("transaction of 100");

    return {
      success: false,
      isSimulated: true,
      needsVerification: isVerificationNeeded,
      error: isVerificationNeeded
        ? "Fast2SMS policy: Requires a 1-time ₹100 verification recharge on fast2sms.com to activate live outward cellular API delivery."
        : errorString,
      message: isVerificationNeeded
        ? "API Key is valid and verified (Wallet: ₹50). Fast2SMS requires 1-time ₹100 recharge on fast2sms.com to activate live cellular delivery."
        : "Error connecting to SMS gateway",
      status: err.response?.status,
    };
  }
}

/**
 * Gather registered users in the specified zones + custom numbers and send broadcast
 */
export async function broadcastZoneAlert({ zoneIds = [], customNumbers = [], message, apiKey }) {
  // 1. Collect custom numbers
  const recipientList = new Set();
  customNumbers.forEach((n) => {
    const f = formatPhoneNumber(n);
    if (f) recipientList.add(f);
  });

  // 2. Lookup registered users in selected zones
  let affectedDistricts = [];
  let affectedStates = [];
  if (zoneIds.length > 0) {
    const zones = await RiskZone.find({ _id: { $in: zoneIds } });
    zones.forEach((z) => {
      if (z.district) affectedDistricts.push(z.district);
      if (z.state) affectedStates.push(z.state);
    });

    if (affectedDistricts.length > 0 || affectedStates.length > 0) {
      const usersInZone = await User.find({
        $or: [
          { "location.district": { $in: affectedDistricts } },
          { "location.state": { $in: affectedStates } },
        ],
        phone: { $exists: true, $ne: "" },
      }).select("phone name");

      usersInZone.forEach((u) => {
        const f = formatPhoneNumber(u.phone);
        if (f) recipientList.add(f);
      });
    }
  }

  const allNumbers = Array.from(recipientList);

  // If no numbers at all, send test message to empty or return
  if (allNumbers.length === 0) {
    return {
      success: false,
      reason: "NO_NUMBERS",
      message: "Please enter at least one mobile number (e.g. your phone number) to send SMS.",
    };
  }

  // Send via Fast2SMS
  return await sendViaFast2SMS({
    message,
    numbers: allNumbers,
    apiKey,
  });
}
