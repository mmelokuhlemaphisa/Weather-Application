import React from "react";
import type { WeatherData } from "../types/Weather";


interface ForecastProps {
  forecast: WeatherData;
  viewMode: "daily" | "hourly";
}

const Forecast: React.FC<ForecastProps> = ({ forecast, viewMode }) => {
  const data = viewMode === "daily" ? forecast.daily : forecast.hourly;

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
