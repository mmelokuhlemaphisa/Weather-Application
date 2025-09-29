import React from "react";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiThunderstorm,
  WiSnow,
  WiFog,
} from "react-icons/wi";

interface WeatherIconProps {
  condition: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ condition }) => {
  const getIcon = () => {
    const c = condition.toLowerCase();
    if (c.includes("sun")) return <WiDaySunny />;
    if (c.includes("cloud")) return <WiCloudy />;
    if (c.includes("rain")) return <WiRain />;
    if (c.includes("storm") || c.includes("thunder")) return <WiThunderstorm />;
    if (c.includes("snow")) return <WiSnow />;
    if (c.includes("fog") || c.includes("mist")) return <WiFog />;
    return <WiDaySunny />; // fallback
  };

  return <span className="weather-icon">{getIcon()}</span>;
};

export default WeatherIcon;
