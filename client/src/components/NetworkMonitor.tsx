import React from 'react';
import { Wifi, WifiOff, Smartphone, Monitor } from 'lucide-react';

interface NetworkInfo {
  type?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

interface NetworkMonitorProps {
  networkInfo: NetworkInfo;
  isOnline: boolean;
}

const NetworkMonitor: React.FC<NetworkMonitorProps> = ({ networkInfo, isOnline }) => {
  const getConnectionTypeIcon = () => {
    if (!isOnline) return <WifiOff className="w-5 h-5 text-red-500" />;
    
    switch (networkInfo.type) {
      case 'wifi':
        return <Wifi className="w-5 h-5 text-green-500" />;
      case 'cellular':
        return <Smartphone className="w-5 h-5 text-blue-500" />;
      default:
        return <Monitor className="w-5 h-5 text-gray-500" />;
    }
  };

  const getConnectionQuality = () => {
    if (!isOnline) return 'Offline';
    
    switch (networkInfo.effectiveType) {
      case 'slow-2g':
        return 'Very Slow';
      case '2g':
        return 'Slow';
      case '3g':
        return 'Moderate';
      case '4g':
        return 'Fast';
      default:
        return 'Unknown';
    }
  };

  const getQualityColor = () => {
    if (!isOnline) return 'text-red-500';
    
    switch (networkInfo.effectiveType) {
      case 'slow-2g':
      case '2g':
        return 'text-red-500';
      case '3g':
        return 'text-warning-500';
      case '4g':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
      {getConnectionTypeIcon()}
      <div className="text-sm">
        <div className="font-medium text-gray-800">
          {networkInfo.type ? networkInfo.type.toUpperCase() : 'Unknown'}
        </div>
        <div className={`text-xs ${getQualityColor()}`}>
          {getConnectionQuality()}
        </div>
      </div>
      {networkInfo.downlink && (
        <div className="text-xs text-gray-600 border-l border-gray-300 pl-3">
          {networkInfo.downlink.toFixed(1)} Mbps
        </div>
      )}
    </div>
  );
};

export default NetworkMonitor;