import React from 'react';
import { History, Trash2, MapPin, Calendar } from 'lucide-react';

interface Location {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  address?: string;
}

interface LocationHistoryProps {
  locations: Location[];
  onClear: () => void;
}

const LocationHistory: React.FC<LocationHistoryProps> = ({ locations, onClear }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <History className="w-5 h-5 mr-2 text-primary-500" />
          Location History
        </h2>
        {locations.length > 0 && (
          <button
            onClick={onClear}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {locations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No location history yet</p>
            <p className="text-sm">Start tracking to see your journey</p>
          </div>
        ) : (
          locations.slice().reverse().map((location) => (
            <div
              key={location.id}
              className="p-3 bg-white/70 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 p-1 bg-primary-100 rounded-full">
                  <MapPin className="w-4 h-4 text-primary-500" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(location.timestamp)}
                  </div>
                  
                  <div className="text-xs text-gray-500 font-mono">
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </div>
                  
                  {location.address && (
                    <div className="text-sm text-gray-700 mt-1">
                      {location.address}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LocationHistory;