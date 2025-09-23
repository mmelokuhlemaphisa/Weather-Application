import axios from "axios";

const API_KEY = "YOUR_API_KEY"; // OpenWeatherMap API
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const getCurrentWeather = (
  city?: string,
  lat?: number,
  lon?: number
) => {
  const url = city
    ? `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
    : `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  return axios.get(url);
};

export const getForecast = (lat: number, lon: number) => {
  return axios.get(
    `${BASE_URL}/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely&appid=${API_KEY}`
  );
};
