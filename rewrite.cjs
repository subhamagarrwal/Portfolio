
const fs = require("fs");
let code = `import { useEffect, useRef } from "react";
import './DynamicBackground.css';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { interpolateColor } from '@/lib/colorUtils';
import { useFireflies } from '@/hooks/useFireflies';
import { useSunPhase } from '@/hooks/useSunPhase';
export const MountainLandscape = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { currentHour, latitude, longitude, isDayOrAfternoon } = useTimeTheme();
  const fireflies = useFireflies(15);
  const { keyframes, times } = useSunPhase(currentHour, latitude, longitude);
  useEffect(() => {
    const updateLandscape = (hours: number) => {
      let start = keyframes[0], end = keyframes[keyframes.length - 1];
      for (let i = 0; i < keyframes.length - 1; i++) {
          if (hours >= keyframes[i].time && hours <= keyframes[i+1].time) {
              start = keyframes[i];
              end = keyframes[i+1];
              break;
          }
      }
      const duration = end.time - start.time;
      const factor = duration === 0 ? 0 : (hours - start.time) / duration;
      if (wrapperRef.current) {
        const style = wrapperRef.current.style;
        style.setProperty('--sky-top', interpolateColor(start.colors.top, end.colors.top, factor));
        style.setProperty('--sky-bottom', interpolateColor(start.colors.bottom, end.colors.bottom, factor));
        style.setProperty('--mountain-back', interpolateColor(start.colors.mBack, end.colors.mBack, factor));
        style.setProperty('--mountain-front', interpolateColor(start.colors.mFront, end.colors.mFront, factor));
        style.setProperty('--ground', interpolateColor(start.colors.ground, end.colors.ground, factor));
        style.setProperty('--sun-glow', interpolateColor(start.colors.sunGlow, end.colors.sunGlow, factor));
        style.setProperty('--stars-opacity', String(start.stars + factor * (end.stars - start.stars)));
        const { sunriseTime, sunsetTime } = times;
        const daylightHours = sunsetTime - sunriseTime;
        const nightHours = 24 - daylightHours;
        let sunProgress = (hours - sunriseTime) / daylightHours;
        if (sunProgress >= -0.1 && sunProgress <= 1.1) {
            style.setProperty('--sun-x', \\%\);
            style.setProperty('--sun-y', \\%\);
            let intensity = Math.max(0, Math.sin(sunProgress * Math.PI));
            style.setProperty('--sun-intensity', intensity.toFixed(3));
            style.setProperty('--sun-angle', \\deg\);
            style.setProperty('--ground-brightness', (0.6 + intensity * 0.4).toFixed(3));
            style.setProperty('--haze-opacity', (1 - Math.sin(sunProgress * Math.PI)).toFixed(3));
        } else {
        }
        let moonTime = hours >= sunsetTime ? (hours - sunsetTime) : (hours + (24 - sunsetTime));
        let moonProgress = moonTime / nightHours;
        if (moonProgress >= -0.1 ; moonProgress <= 1.1) {
            style.setProperty('--moon-x', \\%\);
            style.setProperty('--moon-y', \\%\);
        } else {
        }
      }
    };
    updateLandscape(currentHour);
    const handleDrag = (e: any) => {
      if (e.detail !== null) updateLandscape(e.detail);
    };
    window.addEventListener('manualTimeChange', handleDrag as EventListener);
    return () => window.removeEventListener('manualTimeChange', handleDrag as EventListener);
  }, [currentHour, keyframes, times]);
  return (
          {!isDayOrAfternoon() ; fireflies.map((f, i) => (
              left: \\%\,
              bottom: \\%\,
              animationDelay: \\s\,
