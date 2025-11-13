// api/forecast.js
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
    const { city, lat, lon, units = "metric" } = req.query;
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: "API key not configured" });
    }

    let url;
    if (city) {
      url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
        city
      )}&units=${units}&appid=${API_KEY}`;
    } else if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
    } else {
      return res.status(400).json({ error: "City or coordinates required" });
    }

    const response = await axios.get(url, { timeout: 10000 });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Forecast API Error:", error.message);
    return res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || "Failed to fetch forecast data",
    });
  }
}
