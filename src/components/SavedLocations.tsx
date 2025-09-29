import React from "react";

export interface SavedLocation {
  id: number;
  name: string;
  temperature: number; // in Celsius
  condition?: string; // optional
}

interface SavedLocationsProps {
  locations: SavedLocation[];
  fetchWeather: (location: string) => void;
  removeLocation: (id: number) => void;
}

const SavedLocations: React.FC<SavedLocationsProps> = ({
  locations,
  fetchWeather,
  removeLocation,
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
              {loc.name}: {loc.temperature}°C
              {loc.condition ? `, ${loc.condition}` : ""}
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
