import { useEffect, useState, useRef, useMemo } from 'react';
import './DynamicBackground.css';

const palettes = {
  night:     { top: "#080b18", bottom: "#12162d", mBack: "#121422", mFront: "#0a0c16", ground: "#05060a", sunGlow: "#ffea00" },
  preDawn:   { top: "#1a1835", bottom: "#3a2845", mBack: "#201c2e", mFront: "#14111f", ground: "#0c0a12", sunGlow: "#ffea00" },
  sunrise:   { top: "#384568", bottom: "#e07b53", mBack: "#42384a", mFront: "#2a2230", ground: "#1a1215", sunGlow: "#ff7b00" },
  morning:   { top: "#4f83c4", bottom: "#98c4df", mBack: "#5b84ad", mFront: "#385d82", ground: "#1e3b3a", sunGlow: "#ffe699" }, 
  noon:      { top: "#2074d4", bottom: "#80c4f5", mBack: "#6499c4", mFront: "#3b6c94", ground: "#22473a", sunGlow: "#ffffff" }, 
  afternoon: { top: "#3876be", bottom: "#8ab4d4", mBack: "#5c87ab", mFront: "#345e80", ground: "#203b32", sunGlow: "#ffdb70" },
  sunset:    { top: "#2a3b5c", bottom: "#ff4d00", mBack: "#3a1a1c", mFront: "#1a0b0d", ground: "#140705", sunGlow: "#ff2a00" },
  dusk:      { top: "#1c1d36", bottom: "#6e2030", mBack: "#201524", mFront: "#120a14", ground: "#0a050a", sunGlow: "#ff0000" }
};

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0,0,0];
};

const interpolateColor = (c1: string, c2: string, factor: number) => {
  const rgb1 = hexToRgb(c1);
  const rgb2 = hexToRgb(c2);
  const r = Math.round(rgb1[0] + factor * (rgb2[0] - rgb1[0]));
  const g = Math.round(rgb1[1] + factor * (rgb2[1] - rgb1[1]));
  const b = Math.round(rgb1[2] + factor * (rgb2[2] - rgb1[2]));
  return `rgb(${r}, ${g}, ${b})`;
};

export const MountainLandscape = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [manualTime, setManualTime] = useState<number | null>(null);
  const [times, setTimes] = useState({ sunriseTime: 6.0, sunsetTime: 18.25 });
  const [fireflies, setFireflies] = useState<{left: number, bottom: number, delay: number, duration: number}[]>([]);

  useEffect(() => {
    // Generate fireflies
    const newFireflies = [];
    for(let i=0; i<15; i++) {
      newFireflies.push({
        left: Math.random() * 100,
        bottom: Math.random() * 15 + 2,
        delay: Math.random() * 2,
        duration: Math.random() * 1 + 1.5,
      });
    }
    setFireflies(newFireflies);

    // Watch for time slider
    const handleManualTimeChange = (event: CustomEvent<number | null>) => {
      setManualTime(event.detail);
    };

    window.addEventListener('manualTimeChange', handleManualTimeChange as EventListener);
    
    // Fetch real time
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`);
          const data = await response.json();
          if(data.status === "OK") {
            const rise = new Date(data.results.sunrise);
            const set = new Date(data.results.sunset);
            setTimes({
              sunriseTime: rise.getHours() + (rise.getMinutes() / 60),
              sunsetTime: set.getHours() + (set.getMinutes() / 60)
            });
          }
        } catch (error) {
          console.error("Failed to fetch sun times:", error);
        }
      }, () => {});
    }

    return () => {
      window.removeEventListener('manualTimeChange', handleManualTimeChange as EventListener);
    };
  }, []);

  const keyframes = useMemo(() => {
    const { sunriseTime, sunsetTime } = times;
    const frames = [
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

  useEffect(() => {
    let hours = 0;
    if (manualTime !== null) {
      hours = manualTime;
    } else if (window.manualTimeOverride !== undefined && window.manualTimeOverride !== null) {
      hours = window.manualTimeOverride;
    } else {
      const now = new Date();
      hours = now.getHours() + (now.getMinutes() / 60);
    }

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

      // THE SUN
      let sunProgress = (hours - sunriseTime) / daylightHours; 
      if (sunProgress >= -0.1 && sunProgress <= 1.1) { 
          style.setProperty('--sun-x', `${sunProgress * 100}%`);
          style.setProperty('--sun-y', `${100 - Math.sin(sunProgress * Math.PI) * 85}%`);
          style.setProperty('--sun-opacity', '1');
          
          let intensity = Math.max(0, Math.sin(sunProgress * Math.PI));
          style.setProperty('--sun-intensity', intensity.toFixed(3));
      } else {
          style.setProperty('--sun-opacity', '0'); 
          style.setProperty('--sun-y', `120%`);
          style.setProperty('--sun-intensity', '0');
      }

      // THE MOON 
      let moonTime = hours >= sunsetTime ? (hours - sunsetTime) : (hours + (24 - sunsetTime)); 
      let moonProgress = moonTime / nightHours;
      
      if (moonProgress >= -0.1 && moonProgress <= 1.1) {
          style.setProperty('--moon-x', `${moonProgress * 100}%`);
          style.setProperty('--moon-y', `${100 - Math.sin(moonProgress * Math.PI) * 85}%`);
          style.setProperty('--moon-opacity', '1');
      } else {
          style.setProperty('--moon-opacity', '0');
          style.setProperty('--moon-y', `120%`);
      }
      
      // Dispatch an event globally so other components (like TimeDial) know the phase
      window.dispatchEvent(new CustomEvent('timePhaseInfo', { detail: { name: start.name, hours } }));
    }
  }, [manualTime, keyframes, times]);

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
          {fireflies.map((f, i) => (
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
