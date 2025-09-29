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
  return (
    <div className="current-weather-card">
      <h2>{data.location}</h2>

      {/* Weather icon */}
      <WeatherIcon condition={data.current.condition} />

      <p className="temperature">
        {data.current.temperature}° {units === "metric" ? "C" : "F"}
      </p>
      <p className="condition">{data.current.condition}</p>

      {/* Extra weather details */}
      <div className="weather-details">
        <p>
          <strong>Humidity:</strong> {data.current.humidity}%
        </p>
        <p>
          <strong>Wind Speed:</strong> {data.current.windSpeed}{" "}
          {units === "metric" ? "km/h" : "mph"}
        </p>
      </div>

      <button onClick={() => saveLocation(data.location)}>Save Location</button>
    </div>
  );
};

export default CurrentWeatherCard;
