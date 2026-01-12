import React, { useEffect, useState } from "react";
import { FiMapPin, FiClock, FiX, FiChevronRight } from "react-icons/fi";
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog } from "react-icons/wi";

export interface SavedLocation {
  id: number;
  name: string;
  temperature: number; // in Celsius
  condition?: string; // optional
  country?: string;
  timezone?: number; // Timezone offset in seconds
  icon?: string; // Weather icon code
}

interface SavedLocationsProps {
  locations: SavedLocation[];
  fetchWeather: (location: string) => void;
  removeLocation: (id: number) => void;
}

const getWeatherIcon = (condition?: string) => {
  if (!condition) return <WiDaySunny className="weather-icon" />;
  
  const lowerCondition = condition.toLowerCase();
  
  if (lowerCondition.includes('clear')) return <WiDaySunny className="weather-icon" />;
  if (lowerCondition.includes('cloud')) return <WiCloudy className="weather-icon" />;
  if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) return <WiRain className="weather-icon" />;
  if (lowerCondition.includes('snow')) return <WiSnow className="weather-icon" />;
  if (lowerCondition.includes('thunder')) return <WiThunderstorm className="weather-icon" />;
  if (lowerCondition.includes('fog') || lowerCondition.includes('mist') || lowerCondition.includes('haze')) return <WiFog className="weather-icon" />;
  
  return <WiDaySunny className="weather-icon" />;
};

const formatTime = (timezoneOffset: number = 0) => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000; // Convert to UTC
  const localTime = new Date(utc + (timezoneOffset * 1000));
  
  return localTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  });
};

const SavedLocations: React.FC<SavedLocationsProps> = ({
  locations,
  fetchWeather,
  removeLocation,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  if (locations.length === 0) {
    return (
      <div className="saved-locations empty">
        <div className="empty-state">
          <div className="empty-icon">
            <FiMapPin size={32} />
          </div>
          <h3>No Saved Locations</h3>
          <p>Save locations to see them here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-locations">
      <div className="saved-locations-header">
        <h2><FiMapPin className="header-icon" /> Saved Locations</h2>
        <span className="location-count">{locations.length} saved</span>
      </div>
      
      <div className="locations-grid">
        {locations.map((loc) => (
          <div 
            key={loc.id} 
            className="location-card"
            onClick={() => fetchWeather(loc.name)}
          >
            <div className="location-card-content">
              <div className="location-info">
                <div className="location-main">
                  <h3 className="location-name">
                    {loc.name}
                    {loc.country && <span className="location-country">, {loc.country}</span>}
                  </h3>
                  <div className="location-temp">
                    {Math.round(loc.temperature)}°
                  </div>
                </div>
                <div className="location-meta">
                  {loc.timezone !== undefined && (
                    <div className="location-time">
                      <FiClock className="time-icon" />
                      {formatTime(loc.timezone)}
                    </div>
                  )}
                  {loc.condition && (
                    <div className="location-condition">
                      {loc.condition}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="location-weather">
                {getWeatherIcon(loc.condition)}
                <FiChevronRight className="navigate-icon" />
              </div>
            </div>
            
            <button
              className="remove-btn"
              onClick={(e) => {
                e.stopPropagation();
                removeLocation(loc.id);
              }}
              aria-label={`Remove ${loc.name} from saved locations`}
            >
              <FiX />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedLocations;
