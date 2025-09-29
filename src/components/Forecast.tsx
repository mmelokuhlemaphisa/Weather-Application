import React from "react";
import type { WeatherData } from "../types/Weather";
import WeatherIcon from "./WeatherIcon";

interface ForecastProps {
  forecast: WeatherData;
  viewMode: "daily" | "hourly";
}

const Forecast: React.FC<ForecastProps> = ({ forecast, viewMode }) => {
  let data: any = viewMode === "daily" ? forecast.daily : forecast.hourly;

  if (viewMode === "hourly") {
    const now = new Date();

    // round down to nearest hour
    now.setMinutes(0, 0, 0);

    const tomorrowEnd = new Date();
    tomorrowEnd.setDate(now.getDate() + 1);
    tomorrowEnd.setHours(23, 0, 0, 0);

    // Normalize API times (string → number)
    const raw = forecast.hourly.map((h) => ({
      ...h,
      time: typeof h.time === "string" ? new Date(h.time).getTime() : h.time,
    }));

    // Build hourly list (always exact hours)
    const hours: any[] = [];
    let current = new Date(now);

    while (current <= tomorrowEnd) {
      const t = current.getTime();

      // Find nearest "before" and "after" points
      const before = raw.filter((h) => h.time <= t).slice(-1)[0];
      const after = raw.find((h) => h.time > t);

      let temp = before?.temp ?? after?.temp ?? 0;
      let condition = before?.condition ?? after?.condition ?? "Unknown";
      let precipitation = before?.precipitation ?? after?.precipitation ?? 0;

      // Interpolate if both before & after exist
      if (before && after) {
        const ratio = (t - before.time) / (after.time - before.time);
        temp = Math.round(before.temp + (after.temp - before.temp) * ratio);
        precipitation = Math.round(
          before.precipitation +
            (after.precipitation - before.precipitation) * ratio
        );
      }

      hours.push({ time: t, temp, condition, precipitation });
      current.setHours(current.getHours() + 1);
    }

    data = hours;
  }

  return (
    <div className="forecast-card">
      <h2>Forecast ({viewMode})</h2>
      <div className="forecast-grid">
        {data.map((item: any, i: number) => (
          <div key={i} className="forecast-item">
            {"day" in item ? (
              <>
                <p>{item.day}</p>
                <WeatherIcon condition={item.condition} size={36} />
                <p>
                  {item.high}° / {item.low}°
                </p>
                <p>{item.condition}</p>
              </>
            ) : (
              <>
                <p>
                  {new Date(item.time).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </p>
                <WeatherIcon condition={item.condition} size={36} />
                <p>{item.temp}°C</p>
                <p>{item.condition}</p>
                <p>💧 {item.precipitation}%</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
