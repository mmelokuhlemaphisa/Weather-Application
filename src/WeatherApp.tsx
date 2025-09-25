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
  const [savedLocations, setSavedLocations] = useState<
    { id: number; name: string }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [viewMode, setViewMode] = useState<"daily" | "hourly">("daily");
  const [showSettings, setShowSettings] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

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
    }

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  // --- Mock Weather Generator
  const generateMockWeather = (location: string): WeatherData => {
    const conditions = [
      "Clear",
      "Cloudy",
      "Rainy",
      "Sunny",
      "Partly Cloudy",
      "Storm",
    ];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const baseTemp =
      units === "metric"
        ? Math.floor(Math.random() * 35) + 5
        : Math.floor(Math.random() * 63) + 41;

    return {
      location,
      current: {
        temperature: baseTemp,
        condition,
        humidity: Math.floor(Math.random() * 60) + 20,
        windSpeed: Math.floor(Math.random() * 20) + 1,
        visibility: Math.floor(Math.random() * 10) + 1,
        uvIndex: Math.floor(Math.random() * 11),
        alerts: condition === "Storm" ? ["Severe weather alert!"] : undefined,
      },
      daily: Array.from({ length: 7 }, (_, i) => ({
        day: new Date(Date.now() + i * 86400000).toLocaleDateString("en-US", {
          weekday: "short",
        }),
        high: baseTemp + Math.floor(Math.random() * 8),
        low: baseTemp - Math.floor(Math.random() * 8),
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        precipitation: Math.floor(Math.random() * 100),
      })),
      hourly: Array.from({ length: 24 }, (_, i) => ({
        time: `${i % 12 || 12}:00 ${i < 12 ? "AM" : "PM"}`,
        temp: baseTemp + Math.floor(Math.random() * 6) - 3,
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        precipitation: Math.floor(Math.random() * 100),
      })),
      fetchedAt: new Date().toISOString(),
    };
  };

  const cacheWeather = (locKey: string, data: WeatherData) => {
    localStorage.setItem(
      LOCAL_KEYS.CACHE_PREFIX + locKey,
      JSON.stringify(data)
    );
    localStorage.setItem(LOCAL_KEYS.LAST_LOCATION, locKey);
  };

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

      await new Promise((r) => setTimeout(r, 500));
      const data = generateMockWeather(location);
      setCurrentWeather(data);
      setForecast(data);
      cacheWeather(location, data);

      if (data.current.alerts?.length) {
        showNotification(`Weather alert for ${location}`, {
          body: data.current.alerts.join("\n"),
        });
      }
    } catch {
      setError("Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    fetchWeather(searchQuery.trim());
    setSearchQuery("");
  };

  const saveLocation = (location: string) => {
    if (savedLocations.some((s) => s.name === location)) {
      showNotification(`${location} already saved`);
      return;
    }
    const next = [...savedLocations, { id: Date.now(), name: location }];
    setSavedLocations(next);
    localStorage.setItem(LOCAL_KEYS.LOCATIONS, JSON.stringify(next));
  };

  const removeLocation = (id: number) => {
    const next = savedLocations.filter((s) => s.id !== id);
    setSavedLocations(next);
    localStorage.setItem(LOCAL_KEYS.LOCATIONS, JSON.stringify(next));
  };

  const toggleUnits = () => {
    const next = units === "metric" ? "imperial" : "metric";
    setUnits(next);
    localStorage.setItem(LOCAL_KEYS.UNITS, next);
    if (currentWeather) fetchWeather(currentWeather.location);
  };

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
