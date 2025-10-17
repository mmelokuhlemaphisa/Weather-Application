// src/types.ts
export interface WeatherCurrent {
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  windDirection?: string;
  visibility: number;
  uvIndex: number;
  pressure?: number;
  dewPoint?: number;
  sunrise?: string;
  sunset?: string;
  alerts?: string[]; // optional alerts text
}

export interface DailyForecast {
  day: string;
  high: number;
  low: number;
  condition: string;
  precipitation: number;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  condition: string;
  precipitation: number;
}

export interface WeatherData {
  location: string;
  coordinates?: { lat: number; lon: number };
  current: WeatherCurrent;
  daily: DailyForecast[];
  hourly: HourlyForecast[];
  fetchedAt?: string;
}
