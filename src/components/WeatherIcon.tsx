import React from "react";


interface WeatherIconProps {
  condition: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ condition }) => {
  const iconClass = condition.toLowerCase(); // "rainy" or "sunny"
  return <span className={`weather-icon ${iconClass}`}>{condition}</span>;
};

export default WeatherIcon;
