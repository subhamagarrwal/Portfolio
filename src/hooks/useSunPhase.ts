import { useMemo } from 'react';
import { palettes, Palette } from '@/constants/palettes';

export interface Keyframe {
  time: number;
  name: string;
  colors: Palette;
  stars: number;
}

export const useSunPhase = (currentHour: number | null, latitude: number | null, longitude: number | null) => {
  const times = { sunriseTime: 6.0, sunsetTime: 18.25 };

  const keyframes = useMemo<Keyframe[]>(() => {
    const { sunriseTime, sunsetTime } = times;
    const daylight = sunsetTime - sunriseTime;

    const frames: Keyframe[] = [
      { time: 0,                                   name: "Deep Night",     colors: palettes.night,     stars: 1 },
      { time: sunriseTime - 1.0,                   name: "Deep Night",     colors: palettes.night,     stars: 1 },
      { time: sunriseTime - 0.5,                   name: "Pre-Dawn",       colors: palettes.preDawn,   stars: 0.8 },
      { time: sunriseTime + 0.0,                   name: "Sunrise",        colors: palettes.sunrise,   stars: 0.1 },
      { time: sunriseTime + daylight * 0.15,       name: "Morning",        colors: palettes.morning,   stars: 0 },
      { time: sunriseTime + daylight * 0.45,       name: "High Noon",      colors: palettes.noon,      stars: 0 },
      { time: sunriseTime + daylight * 0.70,       name: "Afternoon",      colors: palettes.afternoon, stars: 0 },
      { time: sunriseTime + daylight * 0.90,       name: "Late Afternoon", colors: palettes.afternoon, stars: 0 },
      { time: sunsetTime - 0.25,                   name: "Sunset",         colors: palettes.sunset,    stars: 0.2 },
      { time: sunsetTime + 0.5,                    name: "Dusk",           colors: palettes.dusk,      stars: 0.8 },
      { time: sunsetTime + 1.5,                    name: "Deep Night",     colors: palettes.night,     stars: 1 },
      { time: 24,                                  name: "Deep Night",     colors: palettes.night,     stars: 1 }
    ];

    return frames;
  }, []);

  return { keyframes, times };
};
