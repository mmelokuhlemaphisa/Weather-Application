import React from "react";


interface SavedLocationsProps {
  locations: { id: number; name: string }[];
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
              {loc.name}
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
