import React from "react";
import { Search, Cloud, Settings } from "lucide-react";


interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  showSettings: boolean;
  setShowSettings: (val: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  showSettings,
  setShowSettings,
}) => {
  return (
    <header className="header">
      <div className="header-top">
        <Cloud className="cloud-icon" />
        <h1>Weather App</h1>
      </div>

      <form onSubmit={handleSearch} className="header-form">
        {/* <Search className="search-icon" /> */}
        <input
          type="text"
          placeholder="Search for a city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">
          <Search className="search-icon-small" />
        </button>
      </form>

      <button
        onClick={() => setShowSettings(!showSettings)}
        className="settings-button"
      >
        <Settings className="settings-icon" />
      </button>
    </header>
  );
};

export default Header;
