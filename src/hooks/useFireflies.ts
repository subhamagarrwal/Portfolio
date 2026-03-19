import { useState, useEffect } from 'react';

export interface Firefly {
  left: number;
  bottom: number;
  delay: number;
  scale: number;
}

export const useFireflies = (count: number = 40) => {
  const [fireflies, setFireflies] = useState<Firefly[]>([]);

  useEffect(() => {
    const newFireflies: Firefly[] = [];
    for(let i=0; i<count; i++) {
        newFireflies.push({
        left: Math.random() * 90,
        bottom: Math.random() * 15 + 10, // kept low in the grass
        delay: Math.random() * 10,
        scale: Math.random() * 1 + 0.5,
        });
    }
    setFireflies(newFireflies);
  }, [count]);

  return fireflies;
};
