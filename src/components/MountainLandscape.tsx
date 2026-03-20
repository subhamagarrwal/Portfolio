import { useEffect, useRef } from 'react';
import './DynamicBackground.css';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { interpolateColor } from '@/lib/colorUtils';
import { useFireflies } from '@/hooks/useFireflies';
import { useSunPhase } from '@/hooks/useSunPhase';

const MountainLandscape = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentHour, latitude, longitude, isDayOrAfternoon } = useTimeTheme();
  const fireflies = useFireflies(25);
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

      // Write to both wrapper and documentElement to allow caching logic to work instantly on reload without flash
      if (wrapperRef.current) {
        const style = wrapperRef.current.style;
        const rootStyle = document.documentElement.style;
        const varsToSave: Record<string, string> = {};

        const setVar = (key: string, val: string) => {
          style.setProperty(key, val);
          rootStyle.setProperty(key, val);
          varsToSave[key] = val;
        };

        setVar('--sky-top', interpolateColor(start.colors.top, end.colors.top, factor));
        setVar('--sky-bottom', interpolateColor(start.colors.bottom, end.colors.bottom, factor));
        setVar('--mountain-back', interpolateColor(start.colors.mBack, end.colors.mBack, factor));
        setVar('--mountain-front', interpolateColor(start.colors.mFront, end.colors.mFront, factor));
        setVar('--ground', interpolateColor(start.colors.ground, end.colors.ground, factor));
        setVar('--sun-glow', interpolateColor(start.colors.sunGlow, end.colors.sunGlow, factor));
        setVar('--stars-opacity', String(start.stars + factor * (end.stars - start.stars)));

        const { sunriseTime, sunsetTime } = times;
        const daylightHours = sunsetTime - sunriseTime;
        const nightHours = 24 - daylightHours;

        // THE SUN
        let sunProgress = (hours - sunriseTime) / daylightHours;
        if (sunProgress >= -0.1 && sunProgress <= 1.1) {
            setVar('--sun-x', `calc(20vw + ${sunProgress * 100}vw)`);
            setVar('--sun-y', `${100 - Math.sin(sunProgress * Math.PI) * 85}%`);
            setVar('--sun-opacity', "1");

            let intensity = Math.max(0, Math.sin(sunProgress * Math.PI));
            setVar('--sun-intensity', intensity.toFixed(3));
            setVar('--sun-angle', `${(sunProgress * 180).toFixed(1)}deg`);
            setVar('--ground-brightness', (0.6 + intensity * 0.4).toFixed(3));
            setVar('--haze-opacity', (1 - Math.sin(sunProgress * Math.PI)).toFixed(3));
        } else {
            setVar('--sun-opacity', "0");
            setVar('--sun-y', "120%");
            setVar('--sun-intensity', "0");
            setVar('--ground-brightness', "0.3");
            setVar('--haze-opacity', "0");
        }

        // THE MOON
        let moonTime = hours >= sunsetTime ? (hours - sunsetTime) : (hours + (24 - sunsetTime));
        let moonProgress = moonTime / nightHours;

        if (moonProgress >= -0.1 && moonProgress <= 1.1) {
            setVar('--moon-x', `calc(20vw + ${moonProgress * 100}vw)`);
            setVar('--moon-y', `${100 - Math.sin(moonProgress * Math.PI) * 85}%`);
            setVar('--moon-opacity', "1");
        } else {
            setVar('--moon-opacity', "0");
            setVar('--moon-y', "120%");
        }

        // FIREFLIES OPACITY
        let fireflyOpacity = 1;
        if (hours > sunriseTime - 2.5 && hours <= sunriseTime) {
            // Fade out as morning comes
            fireflyOpacity = Math.max(0, 1 - (hours - (sunriseTime - 2.5)) / 2.5);
        } else if (hours > sunriseTime && hours < sunsetTime + 0.25) {
            // Day time
            fireflyOpacity = 0;
        } else if (hours >= sunsetTime + 0.25 && hours < sunsetTime + 2) {
            // Fade in as evening comes
            fireflyOpacity = Math.min(1, Math.max(0, (hours - (sunsetTime + 0.25)) / 1.75));
        }
        setVar('--firefly-opacity', fireflyOpacity.toPrecision(3));

        try { localStorage.setItem('portfolio-bg-colors', JSON.stringify(varsToSave)); } catch(e) {}
      }
    };

    updateLandscape(currentHour);

    const handleDrag = (e: any) => {
      if (e.detail !== null) {
        updateLandscape(e.detail);
      }
    };
    
    window.addEventListener('manualTimeChange', handleDrag as EventListener);
    return () => {
      window.removeEventListener('manualTimeChange', handleDrag as EventListener);
    };

  }, [currentHour, keyframes, times]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let grassBlades: GrassBlade[] = [];
    let lastWidth = 0;

    class GrassBlade {
      x: number;
      baseY: number;
      height: number;
      width: number;
      swayAmplitude: number;
      swaySpeed: number;
      phase: number;

      constructor(x: number, baseY: number) {
        this.x = x;
        this.baseY = baseY;
        this.height = 90 + Math.random() * 80;
        this.width = 4 + Math.random() * 2;
        this.swayAmplitude = 2 + Math.random() * 2;
        this.swaySpeed = 0.0003 + Math.random() * 0.0005;
        this.phase = Math.random() * Math.PI * 2;
      }

      draw(time: number, ctx: CanvasRenderingContext2D) {
        this.phase += this.swaySpeed;

        const sway = Math.sin(this.phase + time * this.swaySpeed) * this.swayAmplitude;

        const tipX = this.x + sway;
        const tipY = this.baseY - this.height;

        const baseLeftX = this.x - this.width / 2;
        const baseRightX = this.x + this.width / 2;

        const cpLeftX = this.x - this.width / 2;
        const cpLeftY = this.baseY - this.height * 0.5;
        const cpRightX = this.x + this.width / 2;
        const cpRightY = cpLeftY;

        ctx.beginPath();
        ctx.moveTo(baseLeftX, this.baseY);
        ctx.quadraticCurveTo(cpLeftX, cpLeftY, tipX, tipY);
        ctx.quadraticCurveTo(cpRightX, cpRightY, baseRightX, this.baseY);
        ctx.closePath();

        const colorBase = `hsl(140, 80%, 10%)`;
        const colorTip = `hsl(140, 80%, 20%)`;

        const gradient = ctx.createLinearGradient(this.x, this.baseY, this.x, tipY);
        gradient.addColorStop(0, colorBase);
        gradient.addColorStop(1, colorTip);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    const initGrass = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      // Prevent wild redraws on mobile when scrolling triggers vertical resize
      if (Math.abs(parent.clientWidth - lastWidth) < 15) return;
      lastWidth = parent.clientWidth;
      
      grassBlades = [];
      canvas.height = 250; 

      const numBlades = Math.floor(canvas.width / 2);
      for (let i = 0; i < numBlades; i++) {
        const x = Math.random() * canvas.width;
        grassBlades.push(new GrassBlade(x, canvas.height));
      }
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const blade of grassBlades) {
        blade.draw(time, ctx);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      initGrass();
    };

    window.addEventListener('resize', handleResize);
    initGrass();
    animate(0);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="scene-wrapper dynamic-bg-vars">
        <div className="scene-stars"></div>
        <div className="scene-sun"></div>
        <div className="scene-moon"></div>

        <div className="scene-mountain scene-mountain-back"></div>
        <div className="scene-mountain scene-mountain-front"></div>
        <canvas ref={canvasRef} className="scene-grass-canvas"></canvas>

        <div className="scene-global-illumination"></div>
        <div className="scene-sun-rays"></div>

        <div id="fireflies-container" style={{ opacity: "var(--firefly-opacity, 1)", transition: "opacity 2s linear" }}>
          {!isDayOrAfternoon() && fireflies.map((f, i) => (
            <div key={i} className="scene-firefly" style={{
              left: `${f.left}%`,
              bottom: `${f.bottom}%`,
              animationDelay: `${f.delay}s`,
              "--firefly-scale": f.scale
            } as React.CSSProperties}></div>
          ))}
        </div>
    </div>
  );
};

export default MountainLandscape;
