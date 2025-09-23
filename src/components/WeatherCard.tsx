type WeatherProps = {
  temp: number;
  humidity: number;
  wind: number;
  description: string;
  icon: string;
};

const WeatherCard = ({
  temp,
  humidity,
  wind,
  description,
  icon,
}: WeatherProps) => (
  <div className="bg-white shadow rounded p-4 text-center">
    <img
      src={`http://openweathermap.org/img/wn/${icon}.png`}
      alt={description}
      className="mx-auto"
    />
    <h2 className="text-xl font-semibold">{description}</h2>
    <p>Temperature: {temp}°C</p>
    <p>Humidity: {humidity}%</p>
    <p>Wind Speed: {wind} m/s</p>
  </div>
);

export default WeatherCard;
