// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  BASE: API_BASE_URL,
  HEALTH: `${API_BASE_URL}/api/health`,
  LOCATIONS: `${API_BASE_URL}/api/locations`,
  WEATHER: `${API_BASE_URL}/api/weather`,
  SUGGESTIONS: `${API_BASE_URL}/api/suggestions`,
} as const;

export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'Smart Travel Companion',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  DEV_MODE: import.meta.env.VITE_DEV_MODE === 'true',
  ENABLE_LOGGING: import.meta.env.VITE_ENABLE_LOGGING === 'true',
} as const;

// Helper function for API calls
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};