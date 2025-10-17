import React from "react";
import type { WeatherData } from "../types/Weather";
import WeatherIcon from "./WeatherIcon"; // <-- import your WeatherIcon component

interface CurrentWeatherCardProps {
  data: WeatherData;
  units: "metric" | "imperial";
  saveLocation: (location: string) => void;
}

const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  data,
  units,
  saveLocation,
}) => {
  const formatTime = (timeString?: string) => {
    if (!timeString) return "N/A";
    try {
      return new Date(timeString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timeString;
    }
  };

  const getUVIndexDescription = (uvIndex: number) => {
    if (uvIndex <= 2) return "Low";
    if (uvIndex <= 5) return "Moderate";
    if (uvIndex <= 7) return "High";
    if (uvIndex <= 10) return "Very High";
    return "Extreme";
  };

  return (
    <div className="current-weather-card">
      {/* Header with location and save button */}
      <div className="weather-header">
        <h2>{data.location}</h2>
        <button
          className="save-location-btn"
          onClick={() => saveLocation(data.location)}
          title="Save this location"
        >
          📍 Save
        </button>
      </div>

      {/* Main weather display */}
      <div className="main-weather">
        <div className="weather-icon-container">
          <WeatherIcon condition={data.current.condition} />
        </div>

        <div className="temperature-section">
          <p className="temperature">{Math.round(data.current.temperature)}°</p>
          <p className="feels-like">
            Feels like {Math.round(data.current.feelsLike)}°
            {units === "metric" ? "C" : "F"}
          </p>
          <p className="condition">{data.current.condition}</p>
        </div>
      </div>

      {/* Detailed weather information grid */}
      <div className="weather-details-grid">
        <div className="detail-item">
          <span className="detail-icon">💧</span>
          <div className="detail-content">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{data.current.humidity}%</span>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-icon">💨</span>
          <div className="detail-content">
            <span className="detail-label">Wind</span>
            <span className="detail-value">
              {data.current.windSpeed} {units === "metric" ? "km/h" : "mph"}
              {data.current.windDirection && ` ${data.current.windDirection}`}
            </span>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-icon">👁️</span>
          <div className="detail-content">
            <span className="detail-label">Visibility</span>
            <span className="detail-value">
              {data.current.visibility} {units === "metric" ? "km" : "mi"}
            </span>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-icon">☀️</span>
          <div className="detail-content">
            <span className="detail-label">UV Index</span>
            <span className="detail-value">
              {data.current.uvIndex} (
              {getUVIndexDescription(data.current.uvIndex)})
            </span>
          </div>
        </div>

        {data.current.pressure && (
          <div className="detail-item">
            <span className="detail-icon">📊</span>
            <div className="detail-content">
              <span className="detail-label">Pressure</span>
              <span className="detail-value">{data.current.pressure} hPa</span>
            </div>
          </div>
        )}

        {data.current.dewPoint && (
          <div className="detail-item">
            <span className="detail-icon">💎</span>
            <div className="detail-content">
              <span className="detail-label">Dew Point</span>
              <span className="detail-value">
                {Math.round(data.current.dewPoint)}°
                {units === "metric" ? "C" : "F"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Sun times */}
      {(data.current.sunrise || data.current.sunset) && (
        <div className="sun-times">
          {data.current.sunrise && (
            <div className="sun-time">
              <span className="sun-icon">🌅</span>
              <div>
                <span className="sun-label">Sunrise</span>
                <span className="sun-value">
                  {formatTime(data.current.sunrise)}
                </span>
              </div>
            </div>
          )}
          {data.current.sunset && (
            <div className="sun-time">
              <span className="sun-icon">🌇</span>
              <div>
                <span className="sun-label">Sunset</span>
                <span className="sun-value">
                  {formatTime(data.current.sunset)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Weather alerts */}
      {data.current.alerts && data.current.alerts.length > 0 && (
        <div className="weather-alerts">
          <h4>⚠️ Weather Alerts</h4>
          {data.current.alerts.map((alert, index) => (
            <div key={index} className="alert-item">
              {alert}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrentWeatherCard;
