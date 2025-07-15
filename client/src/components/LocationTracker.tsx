import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Location {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  address?: string;
}

interface LocationTrackerProps {
  currentLocation: { latitude: number; longitude: number } | null;
  locations: Location[];
  isTracking: boolean;
}

// Custom marker icons
const currentLocationIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const historyLocationIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const LocationTracker: React.FC<LocationTrackerProps> = ({ 
  currentLocation, 
  locations, 
  isTracking 
}) => {
  const mapRef = useRef<any>(null);
  const defaultCenter = [51.505, -0.09]; // London coordinates

  useEffect(() => {
    if (mapRef.current && currentLocation) {
      mapRef.current.setView([currentLocation.latitude, currentLocation.longitude], 13);
    }
  }, [currentLocation]);

  const center = currentLocation 
    ? [currentLocation.latitude, currentLocation.longitude] 
    : defaultCenter;

  // Create path from location history
  const pathCoordinates = locations.map(loc => [loc.latitude, loc.longitude]);

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center as [number, number]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Current location marker */}
        {currentLocation && (
          <Marker
            position={[currentLocation.latitude, currentLocation.longitude]}
            icon={currentLocationIcon}
          >
            <Popup>
              <div className="text-center">
                <strong>Current Location</strong>
                <br />
                {isTracking && (
                  <span className="text-green-600 text-sm">
                    🔴 Live Tracking
                  </span>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Historical location markers */}
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            icon={historyLocationIcon}
          >
            <Popup>
              <div className="text-center">
                <strong>Historical Location</strong>
                <br />
                <span className="text-sm text-gray-600">
                  {new Date(location.timestamp).toLocaleString()}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Path polyline */}
        {pathCoordinates.length > 1 && (
          <Polyline
            positions={pathCoordinates as [number, number][]}
            color="blue"
            weight={3}
            opacity={0.7}
            dashArray="5, 10"
          />
        )}
      </MapContainer>
    </div>
  );
};

export default LocationTracker;