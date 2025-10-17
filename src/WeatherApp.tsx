import React, { useEffect, useState } from "react";
import type { WeatherData } from "./types/Weather";
import Header from "./components/Header";
import SettingsPanel from "./components/SettingPanel";
import CurrentWeatherCard from "./components/CurrentWeatherCard";
import SavedLocations from "./components/SavedLocations";
import Forecast from "./components/Forecast";
import {
  showNotification,
  requestNotificationPermission,
} from "./utils/Notification";

const API_KEY = "046e50f67e86c1a28c476fb2dd9cbb9d";

// Utility functions for weather calculations
const getWindDirection = (degrees?: number): string => {
  if (degrees === undefined) return "N/A";
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  return directions[Math.round(degrees / 22.5) % 16];
};

const calculateDewPoint = (temp: number, humidity: number): number => {
  const a = 17.27;
  const b = 237.7;
  const alpha = (a * temp) / (b + temp) + Math.log(humidity / 100);
  return Math.round((b * alpha) / (a - alpha));
};

const LOCAL_KEYS = {
  THEME: "wea_theme",
  UNITS: "wea_units",
  LOCATIONS: "wea_locations",
  CACHE_PREFIX: "wea_cache_",
  LAST_LOCATION: "wea_last_location",
};

const WeatherApp: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
  const [forecast, setForecast] = useState<WeatherData | null>(null);
  const [savedLocations, setSavedLocations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [viewMode, setViewMode] = useState<"daily" | "hourly">("daily");
  const [showSettings, setShowSettings] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // ----------------------------
  // Fetch weather by coordinates
  // ----------------------------
  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    setError("");
    try {
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
      );
      if (!currentRes.ok) throw new Error("Location not found");
      const currentJson = await currentRes.json();

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
      );
      if (!forecastRes.ok) throw new Error("Forecast not found");
      const forecastJson = await forecastRes.json();

      const now = Date.now();
      const twelvePM = new Date();
      twelvePM.setDate(twelvePM.getDate() + 1);
      twelvePM.setHours(12, 0, 0, 0);

      const hourlyData = forecastJson.list
        .map((item: any) => ({
          time: item.dt * 1000,
          temp: Math.round(item.main.temp),
          condition: item.weather[0].description,
          precipitation: item.pop * 100,
        }))
        .filter(
          (item: any) => item.time >= now && item.time <= twelvePM.getTime()
        );

      const data: WeatherData = {
        location: currentJson.name,
        coordinates: { lat: currentJson.coord.lat, lon: currentJson.coord.lon },
        current: {
          temperature: Math.round(currentJson.main.temp),
          feelsLike: Math.round(currentJson.main.feels_like),
          condition: currentJson.weather[0].description,
          humidity: currentJson.main.humidity,
          windSpeed: Math.round(currentJson.wind.speed),
          windDirection: getWindDirection(currentJson.wind?.deg),
          visibility: Math.round((currentJson.visibility / 1000) * 10) / 10,
          uvIndex: 0, // OpenWeather free tier doesn't include UV index
          pressure: currentJson.main.pressure,
          dewPoint: calculateDewPoint(
            currentJson.main.temp,
            currentJson.main.humidity
          ),
          sunrise: new Date(currentJson.sys.sunrise * 1000).toISOString(),
          sunset: new Date(currentJson.sys.sunset * 1000).toISOString(),
        },
        daily: forecastJson.list
          .filter((_: any, idx: number) => idx % 8 === 0)
          .slice(0, 7)
          .map((item: any) => ({
            day: new Date(item.dt * 1000).toLocaleDateString("en-US", {
              weekday: "short",
            }),
            high: Math.round(item.main.temp_max),
            low: Math.round(item.main.temp_min),
            condition: item.weather[0].description,
            precipitation: item.pop * 100,
          })),
        hourly: hourlyData,
        fetchedAt: new Date().toISOString(),
      };

      setCurrentWeather(data);
      setForecast(data);
      cacheWeather(currentJson.name, data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch location weather");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Cache system
  // ----------------------------
  const cacheWeather = (locKey: string, data: WeatherData) => {
    localStorage.setItem(
      LOCAL_KEYS.CACHE_PREFIX + locKey,
      JSON.stringify(data)
    );
    localStorage.setItem(LOCAL_KEYS.LAST_LOCATION, locKey);
  };

  // ----------------------------
  // Fetch weather by city name
  // ----------------------------
  const fetchWeather = async (location: string) => {
    setLoading(true);
    setError("");
    try {
      if (!navigator.onLine) {
        const cached = localStorage.getItem(LOCAL_KEYS.CACHE_PREFIX + location);
        if (cached) {
          const parsed = JSON.parse(cached) as WeatherData;
          setCurrentWeather(parsed);
          setForecast(parsed);
          showNotification(`Showing cached data for ${location}`);
          setLoading(false);
          return;
        } else {
          setError("Offline & no cached data");
          setLoading(false);
          return;
        }
      }

      // Current
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          location
        )}&units=${units}&appid=${API_KEY}`
      );
      if (!currentRes.ok) throw new Error("City not found");
      const currentJson = await currentRes.json();

      // Forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          location
        )}&units=${units}&appid=${API_KEY}`
      );
      if (!forecastRes.ok) throw new Error("Forecast not found");
      const forecastJson = await forecastRes.json();

      const now = Date.now();
      const twelvePM = new Date();
      twelvePM.setDate(twelvePM.getDate() + 1);
      twelvePM.setHours(12, 0, 0, 0);

      const hourlyData = forecastJson.list
        .map((item: any) => ({
          time: item.dt * 1000,
          temp: Math.round(item.main.temp),
          condition: item.weather[0].description,
          precipitation: item.pop * 100,
        }))
        .filter(
          (item: any) => item.time >= now && item.time <= twelvePM.getTime()
        );

      const data: WeatherData = {
        location: currentJson.name,
        coordinates: { lat: currentJson.coord.lat, lon: currentJson.coord.lon },
        current: {
          temperature: Math.round(currentJson.main.temp),
          feelsLike: Math.round(currentJson.main.feels_like),
          condition: currentJson.weather[0].description,
          humidity: currentJson.main.humidity,
          windSpeed: Math.round(currentJson.wind.speed),
          windDirection: getWindDirection(currentJson.wind?.deg),
          visibility: Math.round((currentJson.visibility / 1000) * 10) / 10,
          uvIndex: 0, // OpenWeather free tier doesn't include UV index
          pressure: currentJson.main.pressure,
          dewPoint: calculateDewPoint(
            currentJson.main.temp,
            currentJson.main.humidity
          ),
          sunrise: new Date(currentJson.sys.sunrise * 1000).toISOString(),
          sunset: new Date(currentJson.sys.sunset * 1000).toISOString(),
        },
        daily: forecastJson.list
          .filter((_: any, idx: number) => idx % 8 === 0)
          .slice(0, 7)
          .map((item: any) => ({
            day: new Date(item.dt * 1000).toLocaleDateString("en-US", {
              weekday: "short",
            }),
            high: Math.round(item.main.temp_max),
            low: Math.round(item.main.temp_min),
            condition: item.weather[0].description,
            precipitation: item.pop * 100,
          })),
        hourly: hourlyData,
        fetchedAt: new Date().toISOString(),
      };

      setCurrentWeather(data);
      setForecast(data);
      cacheWeather(location, data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Get current location
  // ----------------------------
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
        },
        (error) => {
          setError("Unable to get your location. Please search for a city.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  // ----------------------------
  // useEffect (initial load)
  // ----------------------------
  useEffect(() => {
    const t = localStorage.getItem(LOCAL_KEYS.THEME);
    const u = localStorage.getItem(LOCAL_KEYS.UNITS) as
      | "metric"
      | "imperial"
      | null;
    const locs = localStorage.getItem(LOCAL_KEYS.LOCATIONS);

    if (t) setDarkMode(t === "dark");
    if (u) setUnits(u);
    if (locs) {
      try {
        setSavedLocations(JSON.parse(locs));
      } catch {}
    }

    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    requestNotificationPermission().catch(() => {});

    const last = localStorage.getItem(LOCAL_KEYS.LAST_LOCATION);
    if (last) {
      const cached = localStorage.getItem(LOCAL_KEYS.CACHE_PREFIX + last);
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as WeatherData;
          setCurrentWeather(parsed);
          setForecast(parsed);
        } catch {}
      }
    } else {
      // 👇 Always try current geolocation first
      getCurrentLocation();
    }

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  // ----------------------------
  // Handlers
  // ----------------------------
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    fetchWeather(searchQuery.trim());
    setSearchQuery("");
  };

  const saveLocation = (location: string) => {
    if (!currentWeather) return;
    const existing = savedLocations.find((s) => s.name === location);
    if (existing) {
      showNotification(`${location} already saved`);
      return;
    }

    const next = [
      ...savedLocations,
      {
        id: Date.now(),
        name: location,
        temperature: currentWeather.current.temperature,
        condition: currentWeather.current.condition,
      },
    ];
    setSavedLocations(next);
    localStorage.setItem(LOCAL_KEYS.LOCATIONS, JSON.stringify(next));
  };

  const removeLocation = (id: number) => {
    const next = savedLocations.filter((s) => s.id !== id);
    setSavedLocations(next);
    localStorage.setItem(LOCAL_KEYS.LOCATIONS, JSON.stringify(next));
  };

  // Toggle Units
  const toggleUnits = () => {
    const next = units === "metric" ? "imperial" : "metric";
    setUnits(next);
    localStorage.setItem(LOCAL_KEYS.UNITS, next);

    const unitLabel = next === "metric" ? "°C" : "°F";
    showNotification(`Temperature units switched to ${unitLabel}`);

    const convertTemp = (temp: number) =>
      next === "imperial"
        ? Math.round((temp * 9) / 5 + 32)
        : Math.round(((temp - 32) * 5) / 9);

    if (currentWeather) {
      setCurrentWeather((prev) =>
        prev
          ? {
              ...prev,
              current: {
                ...prev.current,
                temperature: convertTemp(prev.current.temperature),
              },
              hourly: prev.hourly?.map((h) => ({
                ...h,
                temp: convertTemp(h.temp),
              })),
              daily: prev.daily?.map((d) => ({
                ...d,
                high: convertTemp(d.high),
                low: convertTemp(d.low),
              })),
            }
          : null
      );
    }

    if (forecast) {
      setForecast((prev) =>
        prev
          ? {
              ...prev,
              current: {
                ...prev.current,
                temperature: convertTemp(prev.current.temperature),
              },
              hourly: prev.hourly?.map((h) => ({
                ...h,
                temp: convertTemp(h.temp),
              })),
              daily: prev.daily?.map((d) => ({
                ...d,
                high: convertTemp(d.high),
                low: convertTemp(d.low),
              })),
            }
          : null
      );
    }
  };

  // Toggle Theme
  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem(LOCAL_KEYS.THEME, next ? "dark" : "light");
  };

  const themeClass = darkMode ? "weather-app dark" : "weather-app light";

  return (
    <div className={themeClass}>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        darkMode={darkMode}
        currentLocation={currentWeather?.location}
        getCurrentLocation={getCurrentLocation}
      />

      {!isOnline && (
        <div className="offline-banner">
          Offline — showing cached data if available
        </div>
      )}

      {showSettings && (
        <SettingsPanel
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          units={units}
          toggleUnits={toggleUnits}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onClose={() => setShowSettings(false)}
        />
      )}

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading weather...</p>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {currentWeather && !loading && (
        <div className="grid-container">
          <CurrentWeatherCard
            data={currentWeather}
            units={units}
            saveLocation={saveLocation}
          />
          <SavedLocations
            locations={savedLocations}
            fetchWeather={fetchWeather}
            removeLocation={removeLocation}
          />
        </div>
      )}

      {forecast && !loading && (
        <Forecast forecast={forecast} viewMode={viewMode} />
      )}
    </div>
  );
};

export default WeatherApp;
