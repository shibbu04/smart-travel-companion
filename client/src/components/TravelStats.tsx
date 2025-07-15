import React, { useState, useEffect } from 'react';
import { BarChart3, Clock, MapPin, Route, TrendingUp } from 'lucide-react';

interface Location {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  address?: string;
}

interface TravelStatsProps {
  locations: Location[];
  currentSpeed: number;
}

interface Stats {
  totalDistance: number;
  totalTime: number;
  averageSpeed: number;
  maxSpeed: number;
  locationsVisited: number;
  timeMoving: number;
}

const TravelStats: React.FC<TravelStatsProps> = ({ locations, currentSpeed }) => {
  const [stats, setStats] = useState<Stats>({
    totalDistance: 0,
    totalTime: 0,
    averageSpeed: 0,
    maxSpeed: 0,
    locationsVisited: 0,
    timeMoving: 0
  });

  useEffect(() => {
    calculateStats();
  }, [locations, currentSpeed]);

  const calculateStats = () => {
    if (locations.length < 2) {
      setStats({
        totalDistance: 0,
        totalTime: 0,
        averageSpeed: 0,
        maxSpeed: currentSpeed,
        locationsVisited: locations.length,
        timeMoving: 0
      });
      return;
    }

    let totalDistance = 0;
    let maxSpeed = currentSpeed;
    let timeMoving = 0;

    // Calculate distance using Haversine formula
    for (let i = 1; i < locations.length; i++) {
      const distance = calculateDistance(
        locations[i - 1].latitude,
        locations[i - 1].longitude,
        locations[i].latitude,
        locations[i].longitude
      );
      totalDistance += distance;

      // Calculate time difference and estimate speed
      const timeDiff = (locations[i].timestamp - locations[i - 1].timestamp) / 1000 / 3600; // hours
      if (timeDiff > 0 && distance > 0) {
        const speed = distance / timeDiff;
        maxSpeed = Math.max(maxSpeed, speed);
        
        // If moving faster than 1 km/h, consider it as moving time
        if (speed > 1) {
          timeMoving += timeDiff * 3600; // convert back to seconds
        }
      }
    }

    const totalTime = locations.length > 0 
      ? (locations[locations.length - 1].timestamp - locations[0].timestamp) / 1000 
      : 0;

    const averageSpeed = totalTime > 0 ? (totalDistance / (totalTime / 3600)) : 0;

    setStats({
      totalDistance,
      totalTime,
      averageSpeed,
      maxSpeed,
      locationsVisited: locations.length,
      timeMoving
    });
  };

  // Haversine formula to calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const formatDistance = (km: number): string => {
    if (km < 1) {
      return `${(km * 1000).toFixed(0)}m`;
    }
    return `${km.toFixed(2)}km`;
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-purple-500" />
        Travel Statistics
      </h2>

      <div className="space-y-4">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <Route className="w-5 h-5" />
              <span className="text-sm opacity-90">Distance</span>
            </div>
            <div className="text-2xl font-bold">{formatDistance(stats.totalDistance)}</div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm opacity-90">Total Time</span>
            </div>
            <div className="text-2xl font-bold">{formatTime(stats.totalTime)}</div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm opacity-90">Avg Speed</span>
            </div>
            <div className="text-2xl font-bold">{stats.averageSpeed.toFixed(1)} km/h</div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-5 h-5" />
              <span className="text-sm opacity-90">Locations</span>
            </div>
            <div className="text-2xl font-bold">{stats.locationsVisited}</div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="space-y-3">
          <div className="bg-white/70 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Max Speed Recorded</span>
              <span className="font-semibold text-red-500">
                {stats.maxSpeed.toFixed(1)} km/h
              </span>
            </div>
          </div>

          <div className="bg-white/70 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Time Moving</span>
              <span className="font-semibold text-green-600">
                {formatTime(stats.timeMoving)}
              </span>
            </div>
          </div>

          <div className="bg-white/70 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current Speed</span>
              <span className="font-semibold text-blue-600">
                {currentSpeed.toFixed(1)} km/h
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Distance Progress</span>
              <span>{formatDistance(stats.totalDistance)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (stats.totalDistance / 10) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Speed Progress</span>
              <span>{stats.averageSpeed.toFixed(1)} km/h</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (stats.averageSpeed / 60) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Fun Facts */}
        {stats.totalDistance > 0 && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-200">
            <h3 className="font-semibold text-indigo-800 mb-2">🎯 Fun Facts</h3>
            <div className="text-sm text-indigo-700 space-y-1">
              <p>• You've traveled {(stats.totalDistance * 1000).toFixed(0)} meters!</p>
              <p>• That's about {Math.floor(stats.totalDistance / 0.4)} football fields!</p>
              {stats.averageSpeed > 0 && (
                <p>• At this pace, you could reach the moon in {((384400 / stats.totalDistance) * (stats.totalTime / 3600 / 24)).toFixed(0)} days!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelStats;