import React from "react";


interface SettingsPanelProps {
  darkMode: boolean;
  toggleTheme: () => void;
  units: "metric" | "imperial";
  toggleUnits: () => void;
  viewMode: "daily" | "hourly";
  setViewMode: (mode: "daily" | "hourly") => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  darkMode,
  toggleTheme,
  units,
  toggleUnits,
  viewMode,
  setViewMode,
}) => {
  return (
    <div className="settings-panel">
      <h2>Settings</h2>
      <div className="settings-buttons">
        <button onClick={toggleTheme}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <button onClick={toggleUnits}>
          Units: {units === "metric" ? "°C" : "°F"}
        </button>
        <button
          onClick={() => setViewMode(viewMode === "daily" ? "hourly" : "daily")}
        >
          View: {viewMode}
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
 