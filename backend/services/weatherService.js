/**
 * Weather service abstraction.
 * In "mock" mode (default), returns clearly labeled simulated data.
 * In "live" mode, this is where a real IMD-compatible API call would be made
 * using process.env.WEATHER_API_KEY.
 */

function randomBetween(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

export async function getWeatherSnapshot(district = "Shillong") {
  const mode = process.env.WEATHER_MODE || "mock";

  if (mode === "live" && process.env.WEATHER_API_KEY) {
    // Placeholder for a real integration, e.g. IMD-compatible API.
    // Left unimplemented intentionally - wire up a real provider here.
    throw new Error("Live weather integration not configured.");
  }

  return {
    district,
    isSimulated: true,
    source: "MOCK_WEATHER_SERVICE",
    currentRainfallMm: randomBetween(0, 40),
    rainfall24hMm: randomBetween(10, 180),
    rainfall72hMm: randomBetween(30, 320),
    temperatureC: randomBetween(18, 29),
    humidityPct: randomBetween(55, 95),
    windKmh: randomBetween(2, 25),
    forecastRainfallMm: randomBetween(5, 150),
    updatedAt: new Date().toISOString(),
  };
}
