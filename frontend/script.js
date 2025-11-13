/* ============================================
   WEATHER APP - ENHANCED VERSION
   ============================================ */

const weatherApp = {
  // Update API endpoint
  apiEndpoint: "/api", // Changed from '/api/weather'
  units: "metric",
  isCelsius: true,

  // State Management
  currentCity: null,
  favorites: JSON.parse(localStorage.getItem("favorites")) || [],
  recentSearches: JSON.parse(localStorage.getItem("recentSearches")) || [],
  isDarkMode: localStorage.getItem("darkMode") === "true",

  // ============================================
  // INITIALIZATION
  // ============================================
  init: function () {
    this.setupEventListeners();
    this.loadTheme();
    this.loadDefaultCity();
    this.displayRecentSearches();
  },

  setupEventListeners: function () {
    // Search
    document
      .getElementById("search-button")
      .addEventListener("click", () => this.search());
    document.getElementById("search-input").addEventListener("keyup", (e) => {
      if (e.key === "Enter") this.search();
      else this.handleSearchInput(e.target.value);
    });

    // Location
    document
      .getElementById("location-btn")
      .addEventListener("click", () => this.getUserLocation());

    // Unit Toggle
    document
      .getElementById("unit-toggle")
      .addEventListener("click", () => this.toggleUnits());

    // Theme Toggle
    document
      .getElementById("theme-toggle")
      .addEventListener("click", () => this.toggleTheme());

    // Favorite
    document
      .getElementById("favorite-btn")
      .addEventListener("click", () => this.toggleFavorite());

    // Tabs
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", () => this.switchTab(tab.dataset.tab));
    });

    // Recent Search Clicks
    document.addEventListener("click", (e) => {
      if (e.target.closest(".recent-chip")) {
        const city = e.target.closest(".recent-chip").dataset.city;
        this.fetchWeather(city);
      }
    });

    // Close suggestions when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search")) {
        document.getElementById("search-suggestions").style.display = "none";
      }
    });
  },

  // ============================================
  // GEOLOCATION
  // ============================================
  getUserLocation: function () {
    const btn = document.getElementById("location-btn");
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.fetchWeatherByCoords(
            position.coords.latitude,
            position.coords.longitude
          );
          btn.innerHTML = '<i class="fas fa-location-crosshairs"></i>';
        },
        (error) => {
          this.showError(
            "Unable to get your location. Please search manually."
          );
          btn.innerHTML = '<i class="fas fa-location-crosshairs"></i>';
        }
      );
    } else {
      this.showError("Geolocation is not supported by your browser.");
      btn.innerHTML = '<i class="fas fa-location-crosshairs"></i>';
    }
  },

  // ============================================
  // WEATHER FETCHING (Using Backend Proxy)
  // ============================================
  fetchWeather: async function (city) {
    this.showLoading();

    try {
      // Call backend proxy instead of direct API
      const response = await fetch(
        `${this.apiEndpoint}/current?city=${encodeURIComponent(city)}&units=${
          this.units
        }`
      );

      if (!response.ok) throw new Error("City not found");

      const data = await response.json();
      this.currentCity = city;
      this.displayWeather(data);
      this.addToRecentSearches(city);

      // Fetch additional data
      this.fetchForecast(city);
      this.fetchAirQuality(data.coord.lat, data.coord.lon);
      this.updateDateTime();
      this.updateWeatherBackground(data.weather[0].main, data.weather[0].icon);
    } catch (error) {
      this.showError("City not found. Please try again.");
    }
  },

  fetchWeatherByCoords: async function (lat, lon) {
    this.showLoading();

    try {
      const response = await fetch(
        `${this.apiEndpoint}/current?lat=${lat}&lon=${lon}&units=${this.units}`
      );
      const data = await response.json();

      this.currentCity = data.name;
      this.displayWeather(data);
      this.fetchForecast(data.name);
      this.fetchAirQuality(lat, lon);
      this.updateDateTime();
      this.updateWeatherBackground(data.weather[0].main, data.weather[0].icon);
    } catch (error) {
      this.showError("Unable to fetch weather data.");
    }
  },

  fetchForecast: async function (city) {
    try {
      const response = await fetch(
        `${this.apiEndpoint}/forecast?city=${encodeURIComponent(city)}&units=${
          this.units
        }`
      );
      const data = await response.json();

      this.displayHourlyForecast(data.list.slice(0, 8)); // Next 24 hours
      this.display5DayForecast(data.list);
    } catch (error) {
      console.error("Forecast fetch failed:", error);
    }
  },

  fetchAirQuality: async function (lat, lon) {
    try {
      const response = await fetch(
        `${this.apiEndpoint}/air?lat=${lat}&lon=${lon}`
      );
      const data = await response.json();

      this.displayAirQuality(data.list[0]);
    } catch (error) {
      console.error("Air quality fetch failed:", error);
    }
  },

  // ============================================
  // DISPLAY FUNCTIONS
  // ============================================
  displayWeather: function (data) {
    const {
      name,
      sys: { country, sunrise, sunset },
      main: { temp, feels_like, humidity, pressure, temp_max, temp_min },
      weather,
      wind: { speed },
      visibility,
      clouds: { all: cloudiness },
    } = data;

    // Update main display
    document.getElementById("city").textContent = `${name}, ${country}`;
    document.getElementById("temperature").textContent = this.formatTemp(temp);
    document.getElementById("description").textContent = weather[0].description;
    document.getElementById(
      "weather-icon"
    ).src = `http://openweathermap.org/img/wn/${weather[0].icon}@4x.png`;

    // Update feels like
    document.getElementById("feels-like-temp").textContent =
      this.formatTemp(feels_like);

    // Update quick stats
    document.getElementById("humidity").textContent = `${humidity}%`;
    document.getElementById("wind").textContent = this.isCelsius
      ? `${speed} m/s`
      : `${speed} mph`;
    document.getElementById("pressure").textContent = `${pressure} hPa`;
    document.getElementById("visibility").textContent = `${(
      visibility / 1000
    ).toFixed(1)} km`;

    // Update details
    document.getElementById("sunrise").textContent = this.formatTime(sunrise);
    document.getElementById("sunset").textContent = this.formatTime(sunset);
    document.getElementById("cloudiness").textContent = `${cloudiness}%`;
    document.getElementById("temp-max").textContent = this.formatTemp(temp_max);
    document.getElementById("temp-min").textContent = this.formatTemp(temp_min);
    document.getElementById("uv-index").textContent = "—"; // Requires additional API call

    // Update favorite button
    this.updateFavoriteButton();

    this.hideLoading();
    document.getElementById("weather-container").style.display = "block";
  },

  displayHourlyForecast: function (hours) {
    const container = document.getElementById("hourly-container");
    container.innerHTML = "";

    hours.forEach((hour) => {
      const time = new Date(hour.dt * 1000);
      const hourDiv = document.createElement("div");
      hourDiv.className = "hourly-item";
      hourDiv.innerHTML = `
                <div class="hourly-time">${time.getHours()}:00</div>
                <img src="http://openweathermap.org/img/wn/${
                  hour.weather[0].icon
                }@2x.png" 
                     alt="${hour.weather[0].description}" 
                     class="hourly-icon">
                <div class="hourly-temp">${this.formatTemp(
                  hour.main.temp
                )}</div>
            `;
      container.appendChild(hourDiv);
    });
  },

  display5DayForecast: function (forecastList) {
    const container = document.getElementById("forecast-container");
    container.innerHTML = "";

    // Group by day
    const dailyData = {};
    forecastList.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!dailyData[date]) {
        dailyData[date] = {
          temps: [],
          weather: item.weather[0],
          date: new Date(item.dt * 1000),
        };
      }
      dailyData[date].temps.push(item.main.temp);
    });

    // Display first 5 days
    Object.values(dailyData)
      .slice(0, 5)
      .forEach((day) => {
        const maxTemp = Math.max(...day.temps);
        const minTemp = Math.min(...day.temps);

        const dayDiv = document.createElement("div");
        dayDiv.className = "forecast-item";
        dayDiv.innerHTML = `
                <div class="forecast-day">${this.getDayName(
                  day.date
                )}, ${day.date.getDate()}</div>
                <img src="http://openweathermap.org/img/wn/${
                  day.weather.icon
                }@2x.png" 
                     alt="${day.weather.description}" 
                     class="forecast-icon">
                <div class="forecast-temp">
                    <div class="temp-range">
                        <span class="temp-max">${this.formatTemp(
                          maxTemp
                        )}</span>
                        <span class="temp-min">${this.formatTemp(
                          minTemp
                        )}</span>
                    </div>
                </div>
            `;
        container.appendChild(dayDiv);
      });
  },

  displayAirQuality: function (aqiData) {
    const aqi = aqiData.main.aqi;
    const aqiValues = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
    const aqiColors = ["#00e400", "#ffff00", "#ff7e00", "#ff0000", "#99004c"];

    document.getElementById("aqi-value").textContent = aqi;
    document.getElementById("aqi-status").textContent = aqiValues[aqi - 1];
    document.getElementById("aqi-status").style.color = aqiColors[aqi - 1];

    // Position marker
    const markerPosition = ((aqi - 1) / 4) * 100;
    document.getElementById("aqi-marker").style.left = `${markerPosition}%`;
  },

  // ============================================
  // WEATHER BACKGROUNDS
  // ============================================
  updateWeatherBackground: function (mainWeather, icon) {
    const weatherBg = document.getElementById("weather-bg");
    const weatherAnimation = document.getElementById("weather-animation");

    // Remove all classes
    weatherBg.className = "weather-bg";
    weatherAnimation.className = "weather-animation";

    // Determine background based on weather
    const isNight = icon.includes("n");

    switch (mainWeather.toLowerCase()) {
      case "clear":
        weatherBg.classList.add(isNight ? "clear-night" : "clear-day");
        break;
      case "clouds":
        weatherBg.classList.add("clouds");
        weatherAnimation.classList.add("clouds");
        break;
      case "rain":
      case "drizzle":
        weatherBg.classList.add("rain");
        weatherAnimation.classList.add("rain");
        this.createRaindrops();
        break;
      case "snow":
        weatherBg.classList.add("snow");
        weatherAnimation.classList.add("snow");
        this.createSnowflakes();
        break;
      case "thunderstorm":
        weatherBg.classList.add("thunderstorm");
        this.createLightning();
        break;
      case "mist":
      case "fog":
      case "haze":
        weatherBg.classList.add("mist");
        break;
      default:
        weatherBg.classList.add("default");
    }
  },

  createRaindrops: function () {
    const animation = document.getElementById("weather-animation");
    animation.innerHTML = "";

    for (let i = 0; i < 50; i++) {
      const drop = document.createElement("div");
      drop.className = "raindrop";
      drop.style.cssText = `
                position: absolute;
                width: 2px;
                height: 50px;
                background: linear-gradient(transparent, rgba(255,255,255,0.6));
                left: ${Math.random() * 100}%;
                animation: fall ${Math.random() * 0.5 + 0.5}s linear infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
      animation.appendChild(drop);
    }

    // Add CSS animation if not exists
    if (!document.getElementById("rain-style")) {
      const style = document.createElement("style");
      style.id = "rain-style";
      style.textContent = `
                @keyframes fall {
                    to { transform: translateY(100vh); }
                }
            `;
      document.head.appendChild(style);
    }
  },

  createSnowflakes: function () {
    const animation = document.getElementById("weather-animation");
    animation.innerHTML = "";

    for (let i = 0; i < 30; i++) {
      const flake = document.createElement("div");
      flake.textContent = "❄";
      flake.style.cssText = `
                position: absolute;
                color: rgba(255,255,255,0.8);
                font-size: ${Math.random() * 20 + 10}px;
                left: ${Math.random() * 100}%;
                animation: snowfall ${Math.random() * 5 + 5}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
      animation.appendChild(flake);
    }
  },

  createLightning: function () {
    const animation = document.getElementById("weather-animation");
    setInterval(() => {
      if (Math.random() > 0.9) {
        animation.style.background = "rgba(255,255,255,0.8)";
        setTimeout(() => {
          animation.style.background = "transparent";
        }, 100);
      }
    }, 1000);
  },

  // ============================================
  // THEME & UNITS
  // ============================================
  toggleTheme: function () {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle("dark-mode");

    const icon = document.querySelector("#theme-toggle i");
    icon.className = this.isDarkMode ? "fas fa-sun" : "fas fa-moon";

    localStorage.setItem("darkMode", this.isDarkMode);
  },

  loadTheme: function () {
    if (this.isDarkMode) {
      document.body.classList.add("dark-mode");
      document.querySelector("#theme-toggle i").className = "fas fa-sun";
    }
  },

  toggleUnits: function () {
    this.isCelsius = !this.isCelsius;
    this.units = this.isCelsius ? "metric" : "imperial";

    document.getElementById("unit-display").textContent = this.isCelsius
      ? "°C"
      : "°F";

    // Refresh current city weather
    if (this.currentCity) {
      this.fetchWeather(this.currentCity);
    }
  },

  // ============================================
  // FAVORITES & RECENT SEARCHES
  // ============================================
  toggleFavorite: function () {
    if (!this.currentCity) return;

    const index = this.favorites.indexOf(this.currentCity);
    if (index > -1) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push(this.currentCity);
    }

    localStorage.setItem("favorites", JSON.stringify(this.favorites));
    this.updateFavoriteButton();
  },

  updateFavoriteButton: function () {
    const btn = document.getElementById("favorite-btn");
    const isFavorite = this.favorites.includes(this.currentCity);

    btn.classList.toggle("active", isFavorite);
    btn.querySelector("i").className = isFavorite
      ? "fas fa-heart"
      : "far fa-heart";
  },

  addToRecentSearches: function (city) {
    // Remove if already exists
    this.recentSearches = this.recentSearches.filter((c) => c !== city);

    // Add to beginning
    this.recentSearches.unshift(city);

    // Keep only last 5
    this.recentSearches = this.recentSearches.slice(0, 5);

    localStorage.setItem("recentSearches", JSON.stringify(this.recentSearches));
    this.displayRecentSearches();
  },

  displayRecentSearches: function () {
    const container = document.getElementById("recent-searches");
    container.innerHTML = "";

    this.recentSearches.forEach((city) => {
      const chip = document.createElement("div");
      chip.className = "recent-chip";
      chip.dataset.city = city;
      chip.innerHTML = `
                <i class="fas fa-clock-rotate-left"></i>
                <span>${city}</span>
            `;
      container.appendChild(chip);
    });
  },

  // ============================================
  // SEARCH & AUTOCOMPLETE
  // ============================================
  search: function () {
    const city = document.getElementById("search-input").value.trim();
    if (city) {
      this.fetchWeather(city);
      document.getElementById("search-suggestions").style.display = "none";
    }
  },

  handleSearchInput: function (value) {
    if (value.length < 2) {
      document.getElementById("search-suggestions").style.display = "none";
      return;
    }

    // Simple autocomplete with popular cities
    const cities = [
      "New York",
      "London",
      "Tokyo",
      "Paris",
      "Sydney",
      "Berlin",
      "Moscow",
      "Dubai",
      "Singapore",
      "Mumbai",
      "Los Angeles",
      "Chicago",
      "Toronto",
      "Barcelona",
      "Rome",
    ];

    const matches = cities.filter((city) =>
      city.toLowerCase().startsWith(value.toLowerCase())
    );

    this.displaySuggestions(matches);
  },

  displaySuggestions: function (suggestions) {
    const container = document.getElementById("search-suggestions");

    if (suggestions.length === 0) {
      container.style.display = "none";
      return;
    }

    container.innerHTML = "";
    container.style.display = "block";

    suggestions.forEach((city) => {
      const item = document.createElement("div");
      item.className = "suggestion-item";
      item.textContent = city;
      item.addEventListener("click", () => {
        document.getElementById("search-input").value = city;
        this.fetchWeather(city);
        container.style.display = "none";
      });
      container.appendChild(item);
    });
  },

  // ============================================
  // TAB SWITCHING
  // ============================================
  switchTab: function (tabName) {
    // Remove active class from all tabs and content
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));
    document
      .querySelectorAll(".tab-content")
      .forEach((c) => c.classList.remove("active"));

    // Add active class to clicked tab and corresponding content
    document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");
    document.getElementById(`${tabName}-tab`).classList.add("active");
  },

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  showLoading: function () {
    document.getElementById("loading").style.display = "block";
    document.getElementById("error-message").style.display = "none";
    document.getElementById("weather-container").style.display = "none";
  },

  hideLoading: function () {
    document.getElementById("loading").style.display = "none";
  },

  showError: function (message) {
    document.getElementById("loading").style.display = "none";
    document.getElementById("error-message").style.display = "block";
    document.getElementById("error-message").querySelector("span").textContent =
      message;
    document.getElementById("weather-container").style.display = "none";
  },

  formatTemp: function (temp) {
    return `${Math.round(temp)}°${this.isCelsius ? "C" : "F"}`;
  },

  formatTime: function (timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  getDayName: function (date) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  },

  updateDateTime: function () {
    const now = new Date();
    const options = {
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
    };
    document.getElementById("date-time").textContent = now.toLocaleString(
      "en-US",
      options
    );
  },

  loadDefaultCity: function () {
    const lastCity = localStorage.getItem("lastCity") || "London";
    this.fetchWeather(lastCity);
  },
  // Update fetchWeather function
  fetchWeather: async function (city) {
    this.showLoading();

    try {
      // Updated URL
      const response = await fetch(
        `${this.apiEndpoint}/current?city=${encodeURIComponent(city)}&units=${
          this.units
        }`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "City not found");
      }

      const data = await response.json();
      this.currentCity = city;
      this.displayWeather(data);

      this.fetchForecast(city);
      this.fetchAirQuality(data.coord.lat, data.coord.lon);
      this.updateDateTime();
      this.updateWeatherBackground(data.weather[0].main, data.weather[0].icon);
    } catch (error) {
      console.error("Fetch error:", error);
      this.showError(error.message || "City not found. Please try again.");
    }
  },

  fetchWeatherByCoords: async function (lat, lon) {
    this.showLoading();

    try {
      const response = await fetch(
        `${this.apiEndpoint}/current?lat=${lat}&lon=${lon}&units=${this.units}`
      );

      if (!response.ok) throw new Error("Failed to fetch weather");

      const data = await response.json();

      this.currentCity = data.name;
      this.displayWeather(data);
      this.fetchForecast(data.name);
      this.fetchAirQuality(lat, lon);
      this.updateDateTime();
      this.updateWeatherBackground(data.weather[0].main, data.weather[0].icon);
    } catch (error) {
      this.showError("Unable to fetch weather data.");
    }
  },

  fetchForecast: async function (city) {
    try {
      const response = await fetch(
        `${this.apiEndpoint}/forecast?city=${encodeURIComponent(city)}&units=${
          this.units
        }`
      );

      if (!response.ok) throw new Error("Forecast fetch failed");

      const data = await response.json();

      this.displayHourlyForecast(data.list.slice(0, 8));
      this.display5DayForecast(data.list);
    } catch (error) {
      console.error("Forecast fetch failed:", error);
    }
  },

  fetchAirQuality: async function (lat, lon) {
    try {
      const response = await fetch(
        `${this.apiEndpoint}/air?lat=${lat}&lon=${lon}`
      );

      if (!response.ok) throw new Error("Air quality fetch failed");

      const data = await response.json();
      this.displayAirQuality(data.list[0]);
    } catch (error) {
      console.error("Air quality fetch failed:", error);
    }
  },
};

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  weatherApp.init();
});
