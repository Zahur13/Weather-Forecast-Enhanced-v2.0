// api/air.js
const axios = require("axios");

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { lat, lon } = req.query;
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    if (!lat || !lon) {
      return res.status(400).json({ error: "Coordinates required" });
    }

    if (!API_KEY) {
      return res.status(500).json({ error: "API key not configured" });
    }

    const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const response = await axios.get(url, { timeout: 10000 });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Air Quality API Error:", error.message);
    return res.status(error.response?.status || 500).json({
      error:
        error.response?.data?.message || "Failed to fetch air quality data",
    });
  }
}
