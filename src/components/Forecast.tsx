import React from "react";
import type { WeatherData } from "../types/Weather";
import WeatherIcon from "./WeatherIcon";

interface ForecastProps {
  forecast: WeatherData;
  viewMode: "daily" | "hourly";
}

/**
 * Generate weekday names starting from today
 */
const getWeekDaysFromToday = (count: number) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const todayIndex = new Date().getDay();

  return Array.from({ length: count }, (_, i) =>
    days[(todayIndex + i) % 7]
  );
};

const Forecast: React.FC<ForecastProps> = ({ forecast, viewMode }) => {
  let data: any[] = [];

  /* ---------------- DAILY FORECAST ---------------- */
  if (viewMode === "daily") {
    const weekDays = getWeekDaysFromToday(forecast.daily.length);

    data = forecast.daily.map((day, index) => ({
      ...day,
      day: weekDays[index],
    }));
  }

  /* ---------------- HOURLY FORECAST ---------------- */
  if (viewMode === "hourly") {
    const now = new Date();

    // Round down to nearest hour
    now.setMinutes(0, 0, 0);

    // End at 12 PM tomorrow
    const tomorrowNoon = new Date();
    tomorrowNoon.setDate(now.getDate() + 1);
    tomorrowNoon.setHours(12, 0, 0, 0);

    // Normalize API time values
    const raw = forecast.hourly.map((h) => ({
      ...h,
      time: typeof h.time === "string" ? new Date(h.time).getTime() : h.time,
    }));

    const hours: any[] = [];
    let current = new Date(now);

    while (current <= tomorrowNoon) {
      const t = current.getTime();

      const before = raw.filter((h) => h.time <= t).slice(-1)[0];
      const after = raw.find((h) => h.time > t);

      let temp = before?.temp ?? after?.temp ?? 0;
      let condition = before?.condition ?? after?.condition ?? "Unknown";
      let precipitation = before?.precipitation ?? after?.precipitation ?? 0;

      // Interpolate values if needed
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
        {data.map((item, i) => (
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
