# 🌦️ Weather Forecast Enhanced

<div align="center">

![Weather App Banner](https://img.shields.io/badge/Weather-Forecast-blue?style=for-the-badge&logo=weatherapi)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-black?style=for-the-badge&logo=express)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**A stunning, feature-rich weather application with dynamic backgrounds, real-time data, and advanced forecasting capabilities.**

[Live Demo](#) • [Report Bug](https://github.com/Zahur13/Weather-Forecast/issues) • [Request Feature](https://github.com/Zahur13/Weather-Forecast/issues)

</div>

---

## 📸 Screenshots

<div align="center">

### Clear Day Theme

![Clear Day](https://via.placeholder.com/800x500/667eea/ffffff?text=Clear+Day+View)

### Rainy Weather

![Rainy Weather](https://via.placeholder.com/800x500/4b6cb7/ffffff?text=Rainy+Weather+View)

### Dark Mode

![Dark Mode](https://via.placeholder.com/800x500/1a1a2e/ffffff?text=Dark+Mode+View)

</div>

---

## ✨ Features

### 🎨 **Visual Experience**

- **Dynamic Weather Backgrounds** - Background changes based on current weather conditions

  - ☀️ Clear Sky (Day/Night variants)
  - ☁️ Cloudy with animated clouds
  - 🌧️ Rain with falling raindrops animation
  - ❄️ Snow with snowflake particles
  - ⚡ Thunderstorm with lightning effects
  - 🌫️ Mist/Fog with gradient overlay

- **Glassmorphism UI** - Modern, semi-transparent card design
- **Smooth Animations** - Floating weather icons, hover effects, tab transitions
- **Responsive Design** - Perfect on mobile, tablet, and desktop
- **Dark/Light Mode** - Toggle between themes with persistent storage

### 🌍 **Weather Data**

- **Current Weather** - Real-time temperature, conditions, humidity, wind speed
- **5-Day Forecast** - Daily min/max temperatures with weather icons
- **Hourly Forecast** - Next 24 hours in 3-hour intervals
- **Air Quality Index (AQI)** - Color-coded air quality with 5-level scale
- **Detailed Metrics**:
  - Feels like temperature
  - Atmospheric pressure
  - Visibility distance
  - UV Index
  - Sunrise/Sunset times
  - Cloud coverage
  - Wind direction and speed

### 🚀 **User Features**

- **Geolocation** - Auto-detect user's current location
- **Search with Autocomplete** - Smart city suggestions
- **Favorite Cities** - Save up to unlimited favorites
- **Recent Searches** - Quick access to last 5 searches
- **Unit Toggle** - Switch between Celsius/Fahrenheit
- **Weather Alerts** - Display severe weather warnings (when available)
- **Offline Capability** - LocalStorage for favorites and recent searches

### 🔒 **Security & Performance**

- **Secured API Key** - Backend proxy protects API credentials
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **Error Handling** - Graceful error messages and loading states
- **CORS Protection** - Secure cross-origin requests
- **Environment Variables** - Secure configuration management

---

## 🛠️ Tech Stack

### **Frontend**

- **HTML5** - Semantic markup
- **CSS3** - Advanced animations, gradients, flexbox, grid
- **Vanilla JavaScript (ES6+)** - No framework dependencies
- **Font Awesome** - Icon library

### **Backend**

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Axios** - HTTP client for API requests
- **dotenv** - Environment variable management
- **express-rate-limit** - API rate limiting
- **CORS** - Cross-origin resource sharing

### **APIs**

- **OpenWeatherMap API** - Weather data provider
  - Current Weather API
  - 5-Day Forecast API
  - Air Pollution API

---

## 📦 Installation

### **Prerequisites**

- Node.js (v14 or higher)
- npm or yarn
- OpenWeatherMap API key

### **Step 1: Clone Repository**


git clone https://github.com/Zahur13/Weather-Forecast.git
cd Weather-Forecast-Enhanced

Step 2: Install Dependencies
Bash

npm install
Step 3: Get API Key
Visit OpenWeatherMap
Sign up for a free account
Go to API Keys
Generate a new API key
⏳ Wait 2 hours for activation (new keys need time to activate)
Step 4: Configure Environment
Create backend/.env file:

env

OPENWEATHER_API_KEY=your_api_key_here
PORT=3000
NODE_ENV=development
Step 5: Start Server
Development Mode (with auto-reload)
Bash

npm run dev
Production Mode
Bash

npm start
Step 6: Access Application
Open your browser and navigate to:

text

http://localhost:3000
🎯 Usage Guide
Search for a City
Type city name in the search bar
Select from autocomplete suggestions (optional)
Press Enter or click the search button
Use Current Location
Click the location icon (📍) in the header
Allow browser location access
Weather loads automatically
Toggle Temperature Units
Click the °C/°F button in the header
All temperatures update instantly
Switch to Dark Mode
Click the moon/sun icon in the header
Preference saved in localStorage
Add to Favorites
Search for a city
Click the heart icon ❤️
Access favorites from the favorites modal
View Forecast
Hourly Tab: Next 24 hours
5-Day Tab: Extended forecast
Details Tab: Additional weather metrics
📂 Project Structure
text

Weather-Forecast-Enhanced/
├── frontend/                    # Frontend files
│   ├── index.html              # Main HTML structure
│   ├── style.css               # Styles and animations
│   ├── script.js               # Frontend logic
│   └── img/                    # Image assets
│       ├── humidity.png
│       └── wind.png
│
├── backend/                     # Backend server
│   ├── server.js               # Express server
│   ├── .env                    # Environment variables (DO NOT COMMIT)
│   └── kill-port.js            # Port management utility
│
├── node_modules/               # Dependencies (auto-generated)
├── package.json                # Project metadata
├── package-lock.json           # Dependency lock file
├── .gitignore                  # Git ignore rules
├── LICENSE                     # MIT License
└── README.md                   # This file


⚙️ Configuration
Environment Variables
Variable	Description	Default	Required
OPENWEATHER_API_KEY	Your OpenWeatherMap API key	-	✅ Yes
PORT	Server port number	3000	❌ No
NODE_ENV	Environment (development/production)	development	❌ No
API Endpoints
Endpoint	Method	Description
/api/weather/current	GET	Get current weather by city or coordinates
/api/weather/forecast	GET	Get 5-day forecast
/api/weather/air	GET	Get air quality data
/api/health	GET	Health check endpoint
Query Parameters
Current Weather:

text

GET /api/weather/current?city=London&units=metric
GET /api/weather/current?lat=51.5074&lon=-0.1278&units=metric
Forecast:

text

GET /api/weather/forecast?city=Paris&units=metric
Air Quality:

text

GET /api/weather/air?lat=40.7128&lon=-74.0060
🎨 Code Architecture
Frontend Architecture
1. HTML Structure (index.html)
HTML

<body>
  <!-- Dynamic Weather Background -->
  <div class="weather-bg" id="weather-bg">
    <div class="weather-animation" id="weather-animation"></div>
  </div>

  <!-- Main Container -->
  <div class="container">
    <!-- Header with Controls -->
    <!-- Search Bar with Autocomplete -->
    <!-- Weather Display -->
    <!-- Tabs (Hourly/5-Day/Details) -->
  </div>
</body>
Key Components:

Weather Background Layer - Full-screen dynamic background
Container - Glassmorphism card with all content
Header Controls - Location, unit toggle, theme toggle
Search System - Input + autocomplete dropdown
Weather Display - Current conditions + stats
Tab System - Three content views
2. CSS Architecture (style.css)
CSS Variable System:

CSS

:root {
    --primary-color: #3494e6;
    --secondary-color: #ec6ead;
    --dark-bg: #1a1a2e;
    --shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}
Key Techniques:

CSS Grid - For stat cards and info grids
Flexbox - For header, search, and forecast items
CSS Animations - Rain, snow, clouds, floating icons
Media Queries - Responsive breakpoints
Pseudo-elements - Tab underlines, decorative effects
Animation Examples:

CSS

@keyframes rain {
    0% { background-position: 0% 0%; }
    100% { background-position: 10% 100%; }
}

@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}
3. JavaScript Architecture (script.js)
Object-Oriented Pattern:

JavaScript

const weatherApp = {
    // Configuration
    apiEndpoint: '/api/weather',
    units: 'metric',

    // State
    currentCity: null,
    favorites: [],
    recentSearches: [],

    // Methods
    init() { ... },
    fetchWeather(city) { ... },
    displayWeather(data) { ... },
    toggleTheme() { ... }
};
Key Functions:

Data Fetching (fetchWeather, fetchForecast, fetchAirQuality)

Async/await pattern
Error handling with try/catch
Loading states
Display Functions (displayWeather, displayHourlyForecast, display5DayForecast)

DOM manipulation
Data formatting
Template literals for HTML generation
Background System (updateWeatherBackground)

Weather condition detection
Dynamic class switching
Animation triggering
LocalStorage Management

Favorites persistence
Recent searches
Theme preference
Last searched city
Event Handling

Search (click + Enter key)
Geolocation button
Tab switching
Theme/unit toggles
Example Function:

JavaScript

displayWeather: function(data) {
    const {
        name,
        sys: { country, sunrise, sunset },
        main: { temp, feels_like, humidity, pressure },
        weather,
        wind: { speed },
        visibility
    } = data;

    // Update DOM elements
    document.getElementById('city').textContent = `${name}, ${country}`;
    document.getElementById('temperature').textContent = this.formatTemp(temp);

    // Update background
    this.updateWeatherBackground(weather[0].main, weather[0].icon);

    // Show container
    this.hideLoading();
    document.getElementById('weather-container').style.display = 'block';
}
Backend Architecture
Server Structure (server.js)
Middleware Stack:

JavaScript

app.use(cors());                    // Cross-origin requests
app.use(express.json());            // JSON parsing
app.use(express.static('frontend')); // Serve frontend
app.use('/api/', limiter);          // Rate limiting
Route Handlers:

JavaScript

// 1. Current Weather
app.get('/api/weather/current', async (req, res) => {
    // Extract query params
    // Build API URL
    // Fetch from OpenWeatherMap
    // Return JSON
});

// 2. Forecast
app.get('/api/weather/forecast', async (req, res) => {
    // Similar pattern
});

// 3. Air Quality
app.get('/api/weather/air', async (req, res) => {
    // Similar pattern
});
Error Handling:

JavaScript

try {
    const response = await axios.get(url);
    res.json(response.data);
} catch (error) {
    if (error.response?.status === 401) {
        return res.status(401).json({
            error: 'Invalid API key'
        });
    }
    res.status(500).json({
        error: 'Failed to fetch data'
    });
}
Security Features:

API Key Protection - Never exposed to frontend
Rate Limiting - Prevents abuse
Input Validation - Checks required parameters
Error Sanitization - Doesn't leak sensitive info
🌐 API Integration
OpenWeatherMap API Details
Current Weather API
JavaScript

// Endpoint
GET https://api.openweathermap.org/data/2.5/weather

// Parameters
q: city name (e.g., "London")
lat/lon: coordinates (e.g., lat=51.5074&lon=-0.1278)
units: metric/imperial
appid: your API key

// Response
{
    "name": "London",
    "main": {
        "temp": 15.2,
        "feels_like": 14.5,
        "humidity": 72,
        "pressure": 1013
    },
    "weather": [{
        "main": "Clouds",
        "description": "overcast clouds",
        "icon": "04d"
    }],
    "wind": { "speed": 4.12 },
    "sys": { "sunrise": 1640158934, "sunset": 1640188766 }
}
5-Day Forecast API
JavaScript

// Endpoint
GET https://api.openweathermap.org/data/2.5/forecast

// Returns array of 40 forecast items (3-hour intervals)
{
    "list": [
        {
            "dt": 1640196000,
            "main": { "temp": 14.2 },
            "weather": [{ "main": "Clear", "icon": "01d" }]
        },
        // ... more items
    ]
}
Air Pollution API
JavaScript

// Endpoint
GET https://api.openweathermap.org/data/2.5/air_pollution

// Response
{
    "list": [{
        "main": { "aqi": 2 },  // 1-5 scale
        "components": {
            "co": 230.31,
            "no": 0.01,
            "pm2_5": 5.43
        }
    }]
}
🎨 Styling Details
Color Scheme
Light Mode
CSS

Background Gradients:
  Clear Day: #667eea → #764ba2
  Rain: #4b6cb7 → #182848
  Snow: #e6dada → #274046

Container: rgba(255, 255, 255, 0.95)
Text: #333333
Muted Text: #777777
Dark Mode
CSS

Container: rgba(22, 33, 62, 0.95)
Text: #ffffff
Background: Darker gradients
Typography
CSS

Font Family: 'Segoe UI', Tahoma, Geneva, Verdana
Sizes:
  - H1: 1.8rem
  - Temperature: 4rem (large), 3rem (mobile)
  - Body: 1rem
  - Small: 0.85rem
Spacing System
CSS

Padding: 0.4rem, 0.8rem, 1rem, 1.5rem, 2rem
Margin: 0.5rem, 1rem, 1.5rem, 2rem
Border Radius: 10px, 15px, 20px, 25px, 50px (pills)
Responsive Breakpoints
CSS

@media (max-width: 600px) { /* Mobile */ }
@media (max-width: 400px) { /* Small mobile */ }
🚀 Deployment
Deploy to Heroku
Install Heroku CLI
Bash

brew install heroku/brew/heroku  # macOS
# OR
npm install -g heroku            # Any OS
Login and Create App
Bash

heroku login
heroku create weather-forecast-pro
Set Environment Variables
Bash

heroku config:set OPENWEATHER_API_KEY=your_api_key_here
heroku config:set NODE_ENV=production
Add Procfile
Create Procfile in root:
text

web: node backend/server.js
Deploy
Bash

git push heroku main
heroku open
Deploy to Vercel
Install Vercel CLI
Bash

npm i -g vercel
Create vercel.json
JSON

{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ],
  "env": {
    "OPENWEATHER_API_KEY": "@openweather-api-key"
  }
}
Deploy
Bash

vercel
vercel --prod
Add Environment Variable
Bash

vercel env add OPENWEATHER_API_KEY
Deploy to Netlify (Frontend) + Serverless Functions
Install Netlify CLI
Bash

npm install -g netlify-cli
Create netlify.toml
toml

[build]
  command = "npm install"
  publish = "frontend"
  functions = "netlify/functions"

[dev]
  command = "npm run dev"
  port = 3000

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
Convert to Serverless Functions
Create netlify/functions/weather.js:
JavaScript

const axios = require('axios');

exports.handler = async (event, context) => {
    const { city, units = 'metric' } = event.queryStringParameters;
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${API_KEY}`
        );
        return {
            statusCode: 200,
            body: JSON.stringify(response.data)
        };
    } catch (error) {
        return {
            statusCode: error.response?.status || 500,
            body: JSON.stringify({ error: 'Failed to fetch weather' })
        };
    }
};
Deploy
Bash

netlify deploy --prod
Deploy to Railway
Visit Railway.app
Connect GitHub repository
Add environment variables in dashboard
Deploy automatically
Deploy with Docker
Create Dockerfile:

Dockerfile

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "backend/server.js"]
Create docker-compose.yml:

YAML

version: '3.8'
services:
  weather-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - OPENWEATHER_API_KEY=${OPENWEATHER_API_KEY}
    restart: unless-stopped
Run:

Bash

docker-compose up -d
🐛 Troubleshooting
Common Issues
1. Port Already in Use
Bash

# Kill process on port 3000
kill -9 $(lsof -ti:3000)

# Or use different port
PORT=3001 npm start
2. API Key 401 Error
✅ Check API key is correct in .env
⏳ Wait 2 hours after generating new key
🔄 Restart server after updating .env
3. CORS Errors
JavaScript

// Already handled in server.js
app.use(cors());
4. City Not Found
Check spelling
Try with country code: "London,UK"
Use latitude/longitude instead
5. Loading Forever
Check browser console for errors
Verify backend is running
Check API endpoint URL matches
🤝 Contributing
Contributions are welcome! Here's how:

How to Contribute
Fork the repository
Create a feature branch
Bash

git checkout -b feature/AmazingFeature
Commit your changes
Bash

git commit -m 'Add some AmazingFeature'
Push to the branch
Bash

git push origin feature/AmazingFeature
Open a Pull Request
Code Style Guidelines
Use ES6+ features (arrow functions, async/await, destructuring)
Follow camelCase for variables and functions
Add comments for complex logic
Keep functions small and focused
Use meaningful variable names
Suggested Improvements
 Add weather radar map
 Implement voice search
 Add weather widgets/charts
 Multi-language support
 Historical weather data
 Weather notifications
 Social sharing features
 PWA (Progressive Web App) support
 Offline mode with service workers
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

text

MIT License

Copyright (c) 2024 Zahur Shaikh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
🙏 Acknowledgments
OpenWeatherMap - Weather data API
Font Awesome - Icon library
Express.js - Web framework
Axios - HTTP client
Nodemon - Development tool
Inspiration
Apple Weather App
Weather.com
AccuWeather
Resources Used
MDN Web Docs
CSS Tricks
Stack Overflow
👨‍💻 Author
Zahur Shaikh

GitHub: @Zahur13
Portfolio: https://jahurhusen-portfolio.vercel.app/
LinkedIn: https://www.linkedin.com/in/jahurhusen-shaikh-a309361b9/
📞 Support
If you have any questions or need help:

📧 Email: zbshaikh1326@gmail.com
💬 Open an issue
📖 Check the wiki
⭐ Show Your Support
Give a ⭐️ if this project helped you!

📊 Project Stats
GitHub stars
GitHub forks
GitHub issues
GitHub pull requests

<div align="center">
Made with ❤️ by Zahur Shaikh

⬆ Back to Top

</div>
