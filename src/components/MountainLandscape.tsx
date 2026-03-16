import { useEffect, useRef } from 'react';
import './DynamicBackground.css';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { interpolateColor } from '@/lib/colorUtils';
import { useFireflies } from '@/hooks/useFireflies';
import { useSunPhase } from '@/hooks/useSunPhase';

export const MountainLandscape = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { currentHour, sunData, latitude, longitude, isDayOrAfternoon } = useTimeTheme();
  
  const fireflies = useFireflies(15);
  const { keyframes, times } = useSunPhase(currentHour, latitude, longitude);

  useEffect(() => {
    let hours = currentHour;

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

      // Real Solar Path mapping height
      if (sunData) {
         const altY = Math.max(-20, 100 - (sunData.altitude / 90) * 100);
         style.setProperty('--sun-y', `${altY}%`);
         
         let sunProgress = (hours - sunriseTime) / daylightHours; 
         if (sunProgress >= -0.1 && sunProgress <= 1.1) {
             style.setProperty('--sun-x', `${sunProgress * 100}%`);
             style.setProperty('--sun-opacity', "1");
             let intensity = Math.max(0, Math.sin(sunProgress * Math.PI));
             style.setProperty('--sun-intensity', intensity.toFixed(3));
             style.setProperty('--sun-angle', `${(sunProgress * 180).toFixed(1)}deg`);
             style.setProperty('--ground-brightness', (0.6 + intensity * 0.4).toFixed(3));
             style.setProperty('--haze-opacity', (1 - Math.sin(sunProgress * Math.PI)).toFixed(3));
         } else {
             style.setProperty('--sun-opacity', "0");
             style.setProperty('--sun-intensity', "0");
             style.setProperty('--ground-brightness', "0.3");
             style.setProperty('--haze-opacity', "0");
         }
      } else {
        // Fallback
        let sunProgress = (hours - sunriseTime) / daylightHours; 
        if (sunProgress >= -0.1 && sunProgress <= 1.1) { 
            style.setProperty('--sun-x', `${sunProgress * 100}%`);
            style.setProperty('--sun-y', `${100 - Math.sin(sunProgress * Math.PI) * 85}%`);
            style.setProperty('--sun-opacity', "1");
            
            let intensity = Math.max(0, Math.sin(sunProgress * Math.PI));
            style.setProperty('--sun-intensity', intensity.toFixed(3));
            style.setProperty('--sun-angle', `${(sunProgress * 180).toFixed(1)}deg`);
            style.setProperty('--ground-brightness', (0.6 + intensity * 0.4).toFixed(3));
            style.setProperty('--haze-opacity', (1 - Math.sin(sunProgress * Math.PI)).toFixed(3));
        } else {
            style.setProperty('--sun-opacity', "0"); 
            style.setProperty('--sun-y', "120%");
            style.setProperty('--sun-intensity', "0");
            style.setProperty('--ground-brightness', "0.3");
            style.setProperty('--haze-opacity', "0");
        }
      }

      // THE MOON 
      let moonTime = hours >= sunsetTime ? (hours - sunsetTime) : (hours + (24 - sunsetTime)); 
      let moonProgress = moonTime / nightHours;
      
      if (moonProgress >= -0.1 && moonProgress <= 1.1) {
          style.setProperty('--moon-x', `${moonProgress * 100}%`);
          style.setProperty('--moon-y', `${100 - Math.sin(moonProgress * Math.PI) * 85}%`);
          style.setProperty('--moon-opacity', "1");
      } else {
          style.setProperty('--moon-opacity', "0");
          style.setProperty('--moon-y', "120%");
      }
      
      window.dispatchEvent(new CustomEvent('timePhaseInfo', { detail: { name: start.name, hours } }));
    }
  }, [currentHour, keyframes, times, sunData]);

  return (
    <div ref={wrapperRef} className="scene-wrapper dynamic-bg-vars">
        <div className="scene-stars"></div>
        <div className="scene-sun"></div>
        <div className="scene-moon"></div>
        
        <div className="scene-mountain scene-mountain-back"></div>
        <div className="scene-mountain scene-mountain-front"></div>
        <div className="scene-grass"></div>
        <div className="scene-ground-area"></div>
        
        <div className="scene-global-illumination"></div>
        <div className="scene-sun-rays"></div>
        
        <div id="fireflies-container">
          {!isDayOrAfternoon() && fireflies.map((f, i) => (
            <div key={i} className="scene-firefly" style={{
              left: `${f.left}%`,
              bottom: `${f.bottom}%`,
              animationDelay: `${f.delay}s`,
              animationDuration: `${f.duration}s`
            }}></div>
          ))}
        </div>
    </div>
  );
};

export default MountainLandscape;

