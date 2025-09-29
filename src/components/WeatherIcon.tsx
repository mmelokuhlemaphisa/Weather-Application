import React from "react";
import {
  WiDaySunny,
  WiCloud,
  WiCloudy,
  WiRain,
  WiThunderstorm,
  WiSnow,
  WiFog,
  WiNightClear,
  WiDayCloudy,
} from "react-icons/wi";

interface WeatherIconProps {
  condition: string;
  size?: number; // optional icon size
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ condition, size = 48 }) => {
  // Normalize condition to lowercase for easier matching
  const c = condition.toLowerCase();

  let IconComponent = WiDaySunny; // default icon

  if (c.includes("cloud") && c.includes("partly")) IconComponent = WiDayCloudy;
  else if (c.includes("cloud")) IconComponent = WiCloudy;
  else if (c.includes("rain")) IconComponent = WiRain;
  else if (c.includes("thunder")) IconComponent = WiThunderstorm;
  else if (c.includes("snow")) IconComponent = WiSnow;
  else if (c.includes("fog") || c.includes("mist") || c.includes("haze"))
    IconComponent = WiFog;
  else if (c.includes("clear") && c.includes("night"))
    IconComponent = WiNightClear;

  return <IconComponent size={size} color="white" />;
};

export default WeatherIcon;
