import React from "react";

interface SavedLocationsProps {
  locations: { id: number; name: string }[];
  fetchWeather: (location: string) => void;
  removeLocation: (id: number) => void;
  weatherData: { [location: string]: number }; // temperature for each location
  units: "metric" | "imperial"; // for unit display
}

const SavedLocations: React.FC<SavedLocationsProps> = ({
  locations,
  fetchWeather,
  removeLocation,
  weatherData,
  units,
}) => {
  return (
    <div className="saved-locations">
      <h2>Saved Locations</h2>
      {locations.length === 0 && (
        <p className="no-locations">No saved locations</p>
      )}
      <ul>
        {locations.map((loc) => (
          <li key={loc.id} className="location-item">
            <span
              onClick={() => fetchWeather(loc.name)}
              className="location-name"
            >
              {loc.name}{" "}
              {weatherData[loc.name] !== undefined && (
                <span className="location-temp">
                  {weatherData[loc.name]}°{units === "metric" ? "C" : "F"}
                </span>
              )}
            </span>
            <button
              onClick={() => removeLocation(loc.id)}
              className="remove-btn"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default SavedLocations;
