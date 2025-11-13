const express = require("express");
const axios = require("axios");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/api/", limiter);

// API Key from environment variable
const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// ============================================
// VERIFY API KEY ON STARTUP
// ============================================
console.log("🔑 API Key Status:", API_KEY ? "✅ Loaded" : "❌ Missing");
if (!API_KEY) {
  console.error("⚠️  ERROR: OPENWEATHER_API_KEY not found in .env file!");
  process.exit(1);
}

// Test API Key
async function testAPIKey() {
  try {
    const response = await axios.get(
      `${BASE_URL}/weather?q=London&appid=${API_KEY}`
    );
    console.log("✅ API Key is valid and working!");
    return true;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("❌ API Key is INVALID or NOT ACTIVATED yet!");
      console.error(
        "🔗 Get a new key at: https://home.openweathermap.org/api_keys"
      );
      console.error("⏳ New keys take 2 hours to activate");
    } else {
      console.error("⚠️  API Test Error:", error.message);
    }
    return false;
  }
}

// ============================================
// ROUTES
// ============================================

// Current Weather
app.get("/api/weather/current", async (req, res) => {
  try {
    const { city, lat, lon, units = "metric" } = req.query;

    if (!API_KEY) {
      return res.status(500).json({ error: "API key not configured" });
    }

    let url;
    if (city) {
      url = `${BASE_URL}/weather?q=${encodeURIComponent(
        city
      )}&units=${units}&appid=${API_KEY}`;
    } else if (lat && lon) {
      url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
    } else {
      return res.status(400).json({ error: "City or coordinates required" });
    }

    console.log("📡 Fetching weather for:", city || `${lat},${lon}`);
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(
      "Weather API Error:",
      error.response?.data?.message || error.message
    );

    if (error.response?.status === 401) {
      return res.status(401).json({
        error: "Invalid API key. Please check your OpenWeatherMap API key.",
        details:
          "Visit https://home.openweathermap.org/api_keys to get a valid key",
      });
    }

    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || "Failed to fetch weather data",
    });
  }
});

// Forecast
app.get("/api/weather/forecast", async (req, res) => {
  try {
    const { city, lat, lon, units = "metric" } = req.query;

    if (!API_KEY) {
      return res.status(500).json({ error: "API key not configured" });
    }

    let url;
    if (city) {
      url = `${BASE_URL}/forecast?q=${encodeURIComponent(
        city
      )}&units=${units}&appid=${API_KEY}`;
    } else if (lat && lon) {
      url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
    } else {
      return res.status(400).json({ error: "City or coordinates required" });
    }

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(
      "Forecast API Error:",
      error.response?.data?.message || error.message
    );

    if (error.response?.status === 401) {
      return res.status(401).json({
        error: "Invalid API key",
        details: "Visit https://home.openweathermap.org/api_keys",
      });
    }

    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || "Failed to fetch forecast data",
    });
  }
});

// Air Quality
app.get("/api/weather/air", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: "Coordinates required" });
    }

    if (!API_KEY) {
      return res.status(500).json({ error: "API key not configured" });
    }

    const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(
      "Air Quality API Error:",
      error.response?.data?.message || error.message
    );
    res.status(error.response?.status || 500).json({
      error:
        error.response?.data?.message || "Failed to fetch air quality data",
    });
  }
});

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!API_KEY,
  });
});

// Serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Start Server
app.listen(PORT, async () => {
  console.log("🌤️  Weather API Server running on port", PORT);
  console.log("📡 API Endpoint: http://localhost:" + PORT + "/api/weather");
  console.log("🌐 Frontend: http://localhost:" + PORT);
  console.log("");

  // Test API key
  await testAPIKey();
});
