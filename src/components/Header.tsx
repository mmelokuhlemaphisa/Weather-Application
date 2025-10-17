import React from "react";
import { Search, Cloud, Settings, MapPin } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  showSettings: boolean;
  setShowSettings: (val: boolean) => void;
  darkMode?: boolean;
  currentLocation?: string;
  getCurrentLocation?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  showSettings,
  setShowSettings,
  darkMode = false,
  currentLocation,
  getCurrentLocation,
}) => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="header-brand">
          <div className="brand-icon">
            <Cloud className="cloud-icon" />
          </div>
          <div className="brand-text">
            <h1>WeatherApp</h1>
            <span className="brand-subtitle">Your daily forecast</span>
          </div>
        </div>
      </div>

      <div className="header-center">
        <form onSubmit={handleSearch} className="header-form">
          <div className="search-input-wrapper">
            <Search className="search-icon-input" />
            <input
              type="text"
              placeholder="Search for a city"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>

      <div className="header-right">
        <div className="header-actions">
          {getCurrentLocation && (
            <button
              onClick={getCurrentLocation}
              className="location-button"
              title="Use current location"
            >
              <MapPin className="location-icon" />
            </button>
          )}

          <div className="current-location-display">
            {currentLocation && (
              <span className="current-location" title={currentLocation}>
                📍 {currentLocation}
              </span>
            )}
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`settings-button ${showSettings ? "active" : ""}`}
            title="Settings"
          >
            <Settings className="settings-icon" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
