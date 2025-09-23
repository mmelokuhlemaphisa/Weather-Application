export interface WeatherData {
  temp: number;
  humidity: number;
  wind_speed: number;
  weather: { description: string; icon: string }[];
  dt: number;
}

export interface ForecastData {
  hourly: WeatherData[];
  daily: WeatherData[];
}
