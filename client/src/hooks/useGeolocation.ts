import { useState, useEffect, useRef } from 'react';

interface GeolocationState {
  location: { 
    latitude: number; 
    longitude: number; 
    accuracy: number;
    speed: number;
    heading: number;
  } | null;
  error: string | null;
  isLoading: boolean;
}

export const useGeolocation = (watch: boolean = false) => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    isLoading: false,
  });

  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser.',
        isLoading: false,
      }));
      return;
    }

    if (!watch) {
      // Clear any existing watch
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    const handleSuccess = (position: GeolocationPosition) => {
      console.log('Geolocation success:', position);
      
      setState({
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed ? position.coords.speed * 3.6 : 0, // Convert m/s to km/h
          heading: position.coords.heading || 0,
        },
        error: null,
        isLoading: false,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      console.error('Geolocation error:', error);
      
      let errorMessage = 'An error occurred while retrieving location.';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied. Please enable location permissions in your browser settings.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable. Please check your GPS/network connection.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out. Please try again.';
          break;
      }

      setState({
        location: null,
        error: errorMessage,
        isLoading: false,
      });
    };

    const options: PositionOptions = {
      enableHighAccuracy: true, // Use GPS if available
      timeout: 15000, // 15 seconds timeout
      maximumAge: 0, // Don't use cached position
    };

    console.log('Starting geolocation watch with options:', options);

    // Start watching position
    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    );

    // Cleanup function
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [watch]);

  return state;
};