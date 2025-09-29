import React from "react";
import type { WeatherData } from "../types/Weather";

interface ForecastProps {
  forecast: WeatherData;
  viewMode: "daily" | "hourly";
}

const Forecast: React.FC<ForecastProps> = ({ forecast, viewMode }) => {
  let data = viewMode === "daily" ? forecast.daily : forecast.hourly;

  if (viewMode === "hourly") {
    // Sort hourly data so current hour comes first
    const now = new Date();
    data = forecast.hourly.slice().sort((a, b) => {
      const getHour = (h: any) => {
        const hour = new Date(h.time).getHours();
        return hour;
      };
      // Calculate hour difference from now
      const diffA = (getHour(a) - now.getHours() + 24) % 24;
      const diffB = (getHour(b) - now.getHours() + 24) % 24;
      return diffA - diffB;
    });
  }

  return (
    <div className="forecast-card">
      <h2>Forecast ({viewMode})</h2>
      <div className="forecast-grid">
        {data.map((item, i) => (
          <div key={i} className="forecast-item">
            {"day" in item ? (
              <>
                <p>{item.day}</p>
                <p>
                  {item.high}° / {item.low}°
                </p>
                <p>{item.condition}</p>
              </>
            ) : (
              <>
                <p>{item.time}</p>
                <p>{item.temp}°</p>
                <p>{item.condition}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
