import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Eye, Droplets } from 'lucide-react';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  description: string;
}

interface WeatherWidgetProps {
  location: { latitude: number; longitude: number } | null;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ location }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location) {
      fetchWeatherData();
    }
  }, [location]);

  const fetchWeatherData = async () => {
    if (!location) return;

    setLoading(true);
    setError(null);

    try {
      // Using OpenWeatherMap API (you'll need to get a free API key)
      // For demo purposes, I'm using mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      // Mock weather data based on location
      const mockWeather: WeatherData = {
        temperature: Math.round(20 + Math.random() * 15), // 20-35°C
        condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)],
        humidity: Math.round(40 + Math.random() * 40), // 40-80%
        windSpeed: Math.round(5 + Math.random() * 15), // 5-20 km/h
        visibility: Math.round(8 + Math.random() * 7), // 8-15 km
        description: 'Partly cloudy with light winds'
      };

      setWeather(mockWeather);
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="w-8 h-8 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  const getWeatherGradient = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return 'from-yellow-400 to-orange-500';
      case 'cloudy':
        return 'from-gray-400 to-gray-600';
      case 'rainy':
        return 'from-blue-400 to-blue-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  if (!location) {
    return (
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Cloud className="w-5 h-5 mr-2 text-blue-500" />
          Weather
        </h2>
        <div className="text-center py-8 text-gray-500">
          <Cloud className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Enable location to see weather</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Cloud className="w-5 h-5 mr-2 text-blue-500" />
        Current Weather
      </h2>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading weather...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-red-500">
          <Cloud className="w-12 h-12 mx-auto mb-3 text-red-300" />
          <p>{error}</p>
        </div>
      )}

      {weather && !loading && !error && (
        <div className="space-y-4">
          {/* Main Weather Display */}
          <div className={`bg-gradient-to-r ${getWeatherGradient(weather.condition)} rounded-lg p-4 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{weather.temperature}°C</div>
                <div className="text-sm opacity-90 capitalize">{weather.condition}</div>
              </div>
              <div className="text-white">
                {getWeatherIcon(weather.condition)}
              </div>
            </div>
            <div className="text-sm opacity-90 mt-2">{weather.description}</div>
          </div>

          {/* Weather Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/70 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600">Humidity</span>
              </div>
              <div className="text-lg font-semibold text-gray-800">{weather.humidity}%</div>
            </div>

            <div className="bg-white/70 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Wind className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">Wind</span>
              </div>
              <div className="text-lg font-semibold text-gray-800">{weather.windSpeed} km/h</div>
            </div>

            <div className="bg-white/70 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-gray-600">Visibility</span>
              </div>
              <div className="text-lg font-semibold text-gray-800">{weather.visibility} km</div>
            </div>

            <div className="bg-white/70 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Thermometer className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-600">Feels like</span>
              </div>
              <div className="text-lg font-semibold text-gray-800">{weather.temperature + 2}°C</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;