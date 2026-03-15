import { useState, useEffect, useMemo } from 'react';
import SunCalc from 'suncalc';
import { palettes, Palette } from '@/constants/palettes';

export interface Keyframe {
  time: number;
  name: string;
  colors: Palette;
  stars: number;
}

export const useSunPhase = (currentHour: number | null, latitude: number | null, longitude: number | null) => {
  const [times, setTimes] = useState({ sunriseTime: 6.0, sunsetTime: 18.25 });

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      let calcDate = new Date();
      if (currentHour !== null) {
        calcDate.setHours(Math.floor(currentHour), Math.round((currentHour % 1) * 60), 0, 0);
      }
      
      const scTimes = SunCalc.getTimes(calcDate, latitude, longitude);
      const sRise = scTimes.sunrise;
      const sSet = scTimes.sunsetStart;
      
      let rTime = 6.0;
      let sTime = 18.25;
      
      if (sRise && !isNaN(sRise.getTime())) {
          rTime = sRise.getHours() + (sRise.getMinutes() / 60);
      }
      if (sSet && !isNaN(sSet.getTime())) {
          sTime = sSet.getHours() + (sSet.getMinutes() / 60);
      }
      
      setTimes({
        sunriseTime: rTime,
        sunsetTime: sTime
      });
    }
  }, [latitude, longitude, currentHour]);

  const keyframes = useMemo<Keyframe[]>(() => {
    const { sunriseTime, sunsetTime } = times;
    const frames: Keyframe[] = [
      { time: 0,                            name: "Deep Night", colors: palettes.night,     stars: 1 },
      { time: sunriseTime - 1.0,            name: "Pre-Dawn",   colors: palettes.preDawn,   stars: 0.8 },
      { time: sunriseTime + 0.0,            name: "Sunrise",    colors: palettes.sunrise,   stars: 0.1 },
      { time: sunriseTime + 1.5,            name: "Morning",    colors: palettes.morning,   stars: 0 },
      { time: (sunriseTime + sunsetTime)/2, name: "High Noon",  colors: palettes.noon,      stars: 0 },
      { time: sunsetTime - 2.5,             name: "Afternoon",  colors: palettes.afternoon, stars: 0 }, 
      { time: sunsetTime - 0.75,            name: "Sunset",     colors: palettes.sunset,    stars: 0.1 }, 
      { time: sunsetTime + 0.25,            name: "Dusk",       colors: palettes.dusk,      stars: 0.8 }, 
      { time: sunsetTime + 1.5,             name: "Deep Night", colors: palettes.night,     stars: 1 },
      { time: 24,                           name: "Deep Night", colors: palettes.night,     stars: 1 }
    ];
    return frames.sort((a, b) => a.time - b.time);
  }, [times]);

  return { keyframes, times };
};
