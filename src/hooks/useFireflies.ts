import { useState, useEffect } from 'react';

export interface Firefly {
  left: number;
  bottom: number;
  delay: number;
  duration: number;
}

export const useFireflies = (count: number = 15) => {
  const [fireflies, setFireflies] = useState<Firefly[]>([]);

  useEffect(() => {
    const newFireflies: Firefly[] = [];
    for(let i=0; i<count; i++) {
        newFireflies.push({
        left: Math.random() * 100,
        bottom: Math.random() * 15 + 2,
        delay: Math.random() * 2,
        duration: Math.random() * 1 + 1.5,
        });
    }
    setFireflies(newFireflies);
  }, [count]);

  return fireflies;
};
