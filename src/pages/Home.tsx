import { useEffect, useState } from "react";
import { getCurrentWeather, getForecast } from "../services/WeatherApi";
import WeatherCard from "../components/WeatherCard";
import SearchBar from "../components/SearchBar";
import { saveLocation, getLocations } from "../utils/LocalStorage";

const Home = () => {
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [locations, setLocations] = useState<string[]>(getLocations());

  const fetchWeather = async (city?: string, lat?: number, lon?: number) => {
    try {
      const res = await getCurrentWeather(city, lat, lon);
      setWeather(res.data);
      const fRes = await getForecast(res.data.coord.lat, res.data.coord.lon);
      setForecast(fRes.data);
      if (city) saveLocation(city);
      setLocations(getLocations());
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (city: string) => fetchWeather(city);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      fetchWeather(undefined, pos.coords.latitude, pos.coords.longitude);
    });
  }, []);

  return (
    <div className="p-4">
      <SearchBar onSearch={handleSearch} />
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {weather && (
          <WeatherCard
            temp={weather.main.temp}
            humidity={weather.main.humidity}
            wind={weather.wind.speed}
            description={weather.weather[0].description}
            icon={weather.weather[0].icon}
          />
        )}
        {locations.map((loc) => (
          <button
            key={loc}
            onClick={() => fetchWeather(loc)}
            className="bg-blue-100 p-2 rounded"
          >
            {loc}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
