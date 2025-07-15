import { useState, useEffect } from 'react';

interface NetworkInfo {
  type?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

export const useNetworkInfo = () => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateNetworkInfo = () => {
      // Check if Network Information API is available
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection;

      if (connection) {
        setNetworkInfo({
          type: connection.type,
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
        });
      } else {
        // Fallback for browsers without Network Information API
        setNetworkInfo({
          type: 'unknown',
          effectiveType: '4g', // Assume good connection
        });
      }
    };

    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Initial update
    updateNetworkInfo();
    updateOnlineStatus();

    // Listen for network changes
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;

    if (connection) {
      connection.addEventListener('change', updateNetworkInfo);
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      if (connection) {
        connection.removeEventListener('change', updateNetworkInfo);
      }
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return { networkInfo, isOnline };
};