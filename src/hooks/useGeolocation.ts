import { useState, useEffect } from 'react';

export const useGeolocation = (defaultLat = 40.7128, defaultLng = -74.0060) => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.log("Geolocation error, using default coordinates.", error);
          setLatitude(defaultLat);
          setLongitude(defaultLng);
        }
      );
    } else {
      setLatitude(defaultLat);
      setLongitude(defaultLng);
    }
  }, [defaultLat, defaultLng]);

  return { latitude, longitude };
};
