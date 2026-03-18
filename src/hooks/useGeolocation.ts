import { useState, useEffect } from 'react';

export const useGeolocation = (defaultLat = 40.7128, defaultLng = -74.0060) => {
  // Always initialize with a real number. If cache exists, use it. Otherwise use defaults.
  // This guarantees that sun/moon math has valid coordinates frame 1 and never jumps!
  const [latitude, setLatitude] = useState<number>(() => {
    if (typeof window === 'undefined') return defaultLat;
    const cached = localStorage.getItem('user_lat');
    return cached ? parseFloat(cached) : defaultLat;
  });
  
  const [longitude, setLongitude] = useState<number>(() => {
    if (typeof window === 'undefined') return defaultLng;
    const cached = localStorage.getItem('user_lng');
    return cached ? parseFloat(cached) : defaultLng;
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          localStorage.setItem('user_lat', position.coords.latitude.toString());
          localStorage.setItem('user_lng', position.coords.longitude.toString());
        },
        (error) => {
          // Silent catch - we already have default bounds loaded
        }
      );
    }
  }, []);

  return { latitude, longitude };
};
