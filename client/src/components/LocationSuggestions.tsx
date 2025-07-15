import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Star, Coffee, Utensils, ShoppingBag, Fuel } from 'lucide-react';

interface Suggestion {
  id: string;
  name: string;
  type: 'restaurant' | 'cafe' | 'shopping' | 'gas' | 'attraction';
  distance: string;
  rating: number;
  description: string;
}

interface LocationSuggestionsProps {
  currentLocation: { latitude: number; longitude: number } | null;
}

const LocationSuggestions: React.FC<LocationSuggestionsProps> = ({ currentLocation }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [visibleSuggestions, setVisibleSuggestions] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Mock suggestions data
  const mockSuggestions: Suggestion[] = [
    {
      id: '1',
      name: 'Central Park Cafe',
      type: 'cafe',
      distance: '0.3 km',
      rating: 4.5,
      description: 'Cozy coffee shop with outdoor seating and fresh pastries'
    },
    {
      id: '2',
      name: 'Mediterranean Grill',
      type: 'restaurant',
      distance: '0.5 km',
      rating: 4.7,
      description: 'Authentic Mediterranean cuisine with vegetarian options'
    },
    {
      id: '3',
      name: 'City Mall',
      type: 'shopping',
      distance: '1.2 km',
      rating: 4.2,
      description: 'Large shopping center with 100+ stores and restaurants'
    },
    {
      id: '4',
      name: 'Shell Gas Station',
      type: 'gas',
      distance: '0.8 km',
      rating: 4.0,
      description: 'Full-service gas station with convenience store'
    },
    {
      id: '5',
      name: 'Art Museum',
      type: 'attraction',
      distance: '2.1 km',
      rating: 4.8,
      description: 'Contemporary art museum with rotating exhibitions'
    },
    {
      id: '6',
      name: 'Riverside Restaurant',
      type: 'restaurant',
      distance: '1.5 km',
      rating: 4.6,
      description: 'Fine dining with scenic river views and local cuisine'
    }
  ];

  useEffect(() => {
    if (currentLocation) {
      // Simulate API call delay
      setTimeout(() => {
        setSuggestions(mockSuggestions);
      }, 500);
    }
  }, [currentLocation]);

  useEffect(() => {
    // Intersection Observer for lazy loading animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const suggestionId = entry.target.getAttribute('data-suggestion-id');
            if (suggestionId) {
              setVisibleSuggestions(prev => new Set(prev).add(suggestionId));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'restaurant':
        return <Utensils className="w-5 h-5 text-red-500" />;
      case 'cafe':
        return <Coffee className="w-5 h-5 text-amber-500" />;
      case 'shopping':
        return <ShoppingBag className="w-5 h-5 text-purple-500" />;
      case 'gas':
        return <Fuel className="w-5 h-5 text-blue-500" />;
      case 'attraction':
        return <Star className="w-5 h-5 text-yellow-500" />;
      default:
        return <MapPin className="w-5 h-5 text-gray-500" />;
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (!currentLocation) {
    return (
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Nearby Suggestions</h2>
        <div className="text-center py-8 text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Enable location tracking to see nearby suggestions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Nearby Suggestions</h2>
      
      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            data-suggestion-id={suggestion.id}
            ref={(el) => {
              if (el && observerRef.current) {
                observerRef.current.observe(el);
              }
            }}
            className={`p-4 bg-white/70 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer transform ${
              visibleSuggestions.has(suggestion.id) 
                ? 'animate-fade-in translate-y-0 opacity-100' 
                : 'translate-y-4 opacity-0'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                {getTypeIcon(suggestion.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {suggestion.name}
                  </h3>
                  <span className="text-sm text-gray-500 ml-2">
                    {suggestion.distance}
                  </span>
                </div>
                
                <div className="flex items-center mb-2">
                  <div className="flex items-center mr-2">
                    {renderStars(suggestion.rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {suggestion.rating}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2">
                  {suggestion.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationSuggestions;