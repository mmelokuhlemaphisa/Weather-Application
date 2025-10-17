import React from "react";
import {
  Sun,
  Moon,
  Thermometer,
  Eye,
  Bell,
  RefreshCw,
  Clock,
  Calendar,
  X,
} from "lucide-react";

interface SettingsPanelProps {
  darkMode: boolean;
  toggleTheme: () => void;
  units: "metric" | "imperial";
  toggleUnits: () => void;
  viewMode: "daily" | "hourly";
  setViewMode: (mode: "daily" | "hourly") => void;
  autoRefresh?: boolean;
  setAutoRefresh?: (value: boolean) => void;
  refreshInterval?: number;
  setRefreshInterval?: (minutes: number) => void;
  notificationsEnabled?: boolean;
  setNotificationsEnabled?: (value: boolean) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  darkMode,
  toggleTheme,
  units,
  toggleUnits,
  viewMode,
  setViewMode,
  autoRefresh = false,
  setAutoRefresh,
  refreshInterval = 30,
  setRefreshInterval,
  notificationsEnabled = false,
  setNotificationsEnabled,
  onClose,
}) => {
  return (
    <div className="settings-panel">
      <div className="settings-header">
        <div className="settings-title-section">
          <h2>⚙️ Settings</h2>
          <p className="settings-subtitle">Customize your weather experience</p>
        </div>
        <button
          className="settings-close-button"
          onClick={onClose}
          title="Close settings"
        >
          <X className="close-icon" />
        </button>
      </div>

      <div className="settings-sections">
        {/* Appearance Section */}
        <div className="settings-section">
          <h3 className="section-title">
            <Eye className="section-icon" />
            Appearance
          </h3>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Theme</span>
              <span className="setting-description">
                Switch between light and dark mode
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className={`theme-toggle ${darkMode ? "dark" : "light"}`}
            >
              {darkMode ? (
                <>
                  <Moon className="theme-icon" />
                  Dark Mode
                </>
              ) : (
                <>
                  <Sun className="theme-icon" />
                  Light Mode
                </>
              )}
            </button>
          </div>
        </div>

        {/* Units Section */}
        <div className="settings-section">
          <h3 className="section-title">
            <Thermometer className="section-icon" />
            Units
          </h3>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Temperature Units</span>
              <span className="setting-description">
                Choose between Celsius and Fahrenheit
              </span>
            </div>
            <div className="units-toggle">
              <button
                onClick={() => units === "imperial" && toggleUnits()}
                className={`unit-button ${units === "metric" ? "active" : ""}`}
              >
                °C
              </button>
              <button
                onClick={() => units === "metric" && toggleUnits()}
                className={`unit-button ${
                  units === "imperial" ? "active" : ""
                }`}
              >
                °F
              </button>
            </div>
          </div>
        </div>

        {/* View Section */}
        <div className="settings-section">
          <h3 className="section-title">
            <Calendar className="section-icon" />
            Forecast View
          </h3>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Default View</span>
              <span className="setting-description">
                Choose your preferred forecast display
              </span>
            </div>
            <div className="view-toggle">
              <button
                onClick={() => setViewMode("daily")}
                className={`view-button ${
                  viewMode === "daily" ? "active" : ""
                }`}
              >
                <Calendar className="view-icon" />
                Daily
              </button>
              <button
                onClick={() => setViewMode("hourly")}
                className={`view-button ${
                  viewMode === "hourly" ? "active" : ""
                }`}
              >
                <Clock className="view-icon" />
                Hourly
              </button>
            </div>
          </div>
        </div>

        {/* Auto Refresh Section */}
        {setAutoRefresh && (
          <div className="settings-section">
            <h3 className="section-title">
              <RefreshCw className="section-icon" />
              Auto Refresh
            </h3>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Automatic Updates</span>
                <span className="setting-description">
                  Automatically refresh weather data
                </span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {autoRefresh && setRefreshInterval && (
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Refresh Interval</span>
                  <span className="setting-description">
                    How often to update data (minutes)
                  </span>
                </div>
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="interval-select"
                >
                  <option value={5}>5 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* Notifications Section */}
        {setNotificationsEnabled && (
          <div className="settings-section">
            <h3 className="section-title">
              <Bell className="section-icon" />
              Notifications
            </h3>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Weather Alerts</span>
                <span className="setting-description">
                  Get notified about weather changes
                </span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;
