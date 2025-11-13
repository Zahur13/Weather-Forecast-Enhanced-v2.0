// api/current.js
const axios = require("axios");

// Main handler function
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle OPTIONS request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { city, lat, lon, units = "metric" } = req.query;
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    // Validate API key
    if (!API_KEY) {
      console.error("API key not found");
      return res.status(500).json({
        error: "Server configuration error",
        details: "API key not configured",
      });
    }

    // Build URL
    let url;
    if (city) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&units=${units}&appid=${API_KEY}`;
    } else if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
    } else {
      return res.status(400).json({
        error: "Bad request",
        details: "City or coordinates required",
      });
    }

    console.log(`Fetching weather for: ${city || `${lat},${lon}`}`);

    // Fetch from OpenWeatherMap
    const response = await axios.get(url, {
      timeout: 10000, // 10 second timeout
    });

    // Return data
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Weather API Error:", error.message);

    if (error.response) {
      // OpenWeatherMap API error
      return res.status(error.response.status).json({
        error: error.response.data.message || "Failed to fetch weather data",
        details: error.response.data,
      });
    }

    // Network or timeout error
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
}
