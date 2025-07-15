import React, { useState, useEffect } from 'react';
import { MapPin, Wifi, WifiOff, Smartphone, Navigation, Server } from 'lucide-react';
import { API_ENDPOINTS, APP_CONFIG, apiCall } from './config/api';
import LocationTracker from './components/LocationTracker';
import NetworkMonitor from './components/NetworkMonitor';
import LocationSuggestions from './components/LocationSuggestions';
import LocationHistory from './components/LocationHistory';
import PathCanvas from './components/PathCanvas';
import WeatherWidget from './components/WeatherWidget';
import Speedometer from './components/Speedometer';
import TravelStats from './components/TravelStats';
import { useGeolocation } from './hooks/useGeolocation';
import { useNetworkInfo } from './hooks/useNetworkInfo';
import { useBackgroundTasks } from './hooks/useBackgroundTasks';

interface Location {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  address?: string;
}

function App() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [serverStatus, setServerStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const { location, error: geoError, isLoading } = useGeolocation(isTracking);
  const { networkInfo, isOnline } = useNetworkInfo();
  
  // Background task for connectivity monitoring and location saving
  useBackgroundTasks(() => {
    checkServerHealth();
    if (isTracking && location) {
      saveLocationToHistory(location);
    }
  }, 10000); // Check every 10 seconds

  useEffect(() => {
    loadLocationHistory();
    checkServerHealth();
  }, []);

  const checkServerHealth = async () => {
    try {
      await apiCall('/api/health');
      setServerStatus('connected');
    } catch (error) {
      if (APP_CONFIG.ENABLE_LOGGING) {
        console.error('Server health check failed:', error);
      }
      setServerStatus('disconnected');
    }
  };

  const saveLocationToHistory = async (location: { 
    latitude: number; 
    longitude: number; 
    accuracy: number;
    speed: number;
    heading: number;
  }) => {
    try {
      const newLocation: Location = {
        id: Date.now().toString(),
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: Date.now(),
      };

      const savedLocation = await apiCall('/api/locations', {
        method: 'POST',
        body: JSON.stringify(newLocation),
      });

      setLocations(prev => {
        // Avoid duplicates by checking if location already exists
        const exists = prev.some(loc => 
          Math.abs(loc.latitude - savedLocation.latitude) < 0.0001 &&
          Math.abs(loc.longitude - savedLocation.longitude) < 0.0001
        );
        return exists ? prev : [...prev, savedLocation];
      });
    } catch (error) {
      if (APP_CONFIG.ENABLE_LOGGING) {
        console.error('Error saving location:', error);
      }
    }
  };

  const loadLocationHistory = async () => {
    try {
      const data = await apiCall('/api/locations');
      setLocations(data);
    } catch (error) {
      if (APP_CONFIG.ENABLE_LOGGING) {
        console.error('Error loading location history:', error);
      }
    }
  };

  const handleStartTracking = () => {
    setIsTracking(true);
  };

  const handleStopTracking = () => {
    setIsTracking(false);
  };

  const clearHistory = async () => {
    try {
      await apiCall('/api/locations', {
        method: 'DELETE',
      });
      setLocations([]);
    } catch (error) {
      if (APP_CONFIG.ENABLE_LOGGING) {
        console.error('Error clearing history:', error);
      }
    }
  };

  const getServerStatusColor = () => {
    switch (serverStatus) {
      case 'connected':
        return 'text-green-500';
      case 'disconnected':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getServerStatusText = () => {
    switch (serverStatus) {
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Checking...';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <header className="glass-card rounded-none border-0 border-b border-white/20 p-4 mb-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg">
              <Navigation className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Smart Travel Companion</h1>
            <h1 className="text-2xl font-bold text-gray-800">{APP_CONFIG.NAME}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Server Status */}
            <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20">
              <Server className={`w-4 h-4 ${getServerStatusColor()}`} />
              <span className={`text-sm font-medium ${getServerStatusColor()}`}>
                {getServerStatusText()}
              </span>
            </div>
            
            {/* Network Monitor */}
            <NetworkMonitor networkInfo={networkInfo} isOnline={isOnline} />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Controls and Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Location Controls */}
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary-500" />
                Location Controls
              </h2>
              
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <button
                    onClick={handleStartTracking}
                    disabled={isTracking || isLoading}
                    className={`flex-1 ${isTracking ? 'bg-gray-300 cursor-not-allowed' : 'btn-primary'}`}
                  >
                    {isLoading ? 'Getting Location...' : 'Start Tracking'}
                  </button>
                  <button
                    onClick={handleStopTracking}
                    disabled={!isTracking}
                    className={`flex-1 ${!isTracking ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold'}`}
                  >
                    Stop Tracking
                  </button>
                </div>

                {geoError && (
                  <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                    {geoError}
                  </div>
                )}

                {location && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Current Location</h3>
                    <p className="text-sm text-green-700">
                      Lat: {location.latitude.toFixed(6)}<br />
                      Lng: {location.longitude.toFixed(6)}<br />
                      Accuracy: ±{location.accuracy.toFixed(0)}m
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Speedometer */}
            {location && (
              <Speedometer 
                speed={location.speed} 
                heading={location.heading} 
                accuracy={location.accuracy}
              />
            )}

            {/* Path Visualization */}
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Movement Path</h2>
              <PathCanvas locations={locations} />
            </div>
          </div>

          {/* Middle Column - Map and Weather */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map */}
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Live Location Map</h2>
              <LocationTracker 
                currentLocation={location ? {
                  latitude: location.latitude,
                  longitude: location.longitude
                } : null} 
                locations={locations}
                isTracking={isTracking}
              />
            </div>

            {/* Weather Widget */}
            <WeatherWidget 
              location={location ? {
                latitude: location.latitude,
                longitude: location.longitude
              } : null} 
            />
          </div>

          {/* Right Column - Stats and Suggestions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Travel Statistics */}
            <TravelStats 
              locations={locations} 
              currentSpeed={location?.speed || 0}
            />

            {/* Location History */}
            <LocationHistory locations={locations} onClear={clearHistory} />

            {/* Location Suggestions */}
            <LocationSuggestions 
              currentLocation={location ? {
                latitude: location.latitude,
                longitude: location.longitude
              } : null} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;