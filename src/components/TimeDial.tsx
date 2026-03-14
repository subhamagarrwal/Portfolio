import React, { useState, useEffect, useRef } from 'react';
import './DynamicBackground.css';
import { useTimeTheme } from '@/hooks/useTimeTheme';

interface TimeDialProps {
  onClose: () => void;
  isDarkModeOverride: boolean;
}

export const TimeDial: React.FC<TimeDialProps> = ({ onClose, isDarkModeOverride }) => {
  const dialRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [timeState, setTimeState] = useState({ name: 'Night', hours: 12 });

  useEffect(() => {
    const handlePhaseInfo = (e: CustomEvent) => {
      setTimeState({ name: e.detail.name, hours: e.detail.hours });
    };
    window.addEventListener('timePhaseInfo', handlePhaseInfo as EventListener);
    
    // Mount info
    const initialHour = window.manualTimeOverride !== undefined ? window.manualTimeOverride : new Date().getHours() + new Date().getMinutes()/60;
    setTimeState(prev => ({ ...prev, hours: initialHour }));
    
    return () => {
      window.removeEventListener('timePhaseInfo', handlePhaseInfo as EventListener);
    };
  }, []);

  const handleDrag = (clientX: number, clientY: number) => {
    if (!dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let angle = Math.atan2(clientY - centerY, clientX - centerX);
    angle += Math.PI / 2; 
    if (angle < 0) angle += 2 * Math.PI;

    let hours = (angle / (2 * Math.PI)) * 24;
    window.dispatchEvent(new CustomEvent('manualTimeChange', { detail: hours }));
  };

  const onMouseMove = (e: MouseEvent) => {
    if (isDragging) handleDrag(e.clientX, e.clientY);
  };
  
  const onTouchMove = (e: TouchEvent) => {
    if (isDragging && e.touches.length > 0) {
      handleDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  useEffect(() => {
    const onMouseUp = () => setIsDragging(false);
    const onTouchEnd = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchmove', onTouchMove, { passive: false });
      document.addEventListener('touchend', onTouchEnd);
    } else {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging]);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleDrag(e.clientX, e.clientY);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleDrag(e.touches[0].clientX, e.touches[0].clientY);
  };

  const degrees = (timeState.hours / 24) * 360;
  
  const hrs = Math.floor(timeState.hours);
  const mins = Math.round((timeState.hours - hrs) * 60);
  const displayHrs = hrs === 0 || hrs === 24 ? 12 : (hrs > 12 ? hrs - 12 : hrs);
  const displayMins = mins.toString().padStart(2, '0');
  const ampm = hrs >= 12 && hrs < 24 ? 'PM' : 'AM';

  return (
    <div className="glass-dock-container flex flex-col items-center">
      <div className="time-dial-controls" ref={dialRef}
           onMouseDown={onMouseDown}
           onTouchStart={onTouchStart}>
        <div className="time-dial-ring">
            <div className="time-dial-knob-wrapper" style={{ transform: `rotate(${degrees}deg)` }}>
                <div className="time-dial-knob"></div>
            </div>
        </div>
        <div className="time-clock-display">
            <div className="time-clock-time">{`${displayHrs}:${displayMins} ${ampm}`}</div>
            <div className="time-clock-period">{timeState.name}</div>
        </div>
      </div>
      <button
          onClick={onClose}
          className={`
            relative z-10 mt-6 px-4 py-1.5 rounded-lg text-xs font-medium
            transition-all duration-200 touch-manipulation
            ${isDarkModeOverride 
              ? 'bg-white/20 text-white hover:bg-white/30' 
              : 'bg-black/20 text-black hover:bg-black/30'
            }
          `}
        >
          ✕ Close
      </button>
    </div>
  );
};
