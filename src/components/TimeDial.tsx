import React, { useState, useEffect, useRef } from 'react';
import './DynamicBackground.css';
import { useTimeTheme } from '@/hooks/useTimeTheme';

interface TimeDialProps {
  onClose: () => void;
  isDarkModeOverride: boolean;
}

export const TimeDial: React.FC<TimeDialProps> = ({ onClose, isDarkModeOverride }) => {
  const { currentHour } = useTimeTheme();
  const dialRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  
  const setDragging = (val: boolean) => {
    isDraggingRef.current = val;
    setIsDragging(val);
  };

  const [timeState, setTimeState] = useState({ name: 'Syncing...', hours: (window as any).manualTimeOverride !== undefined && (window as any).manualTimeOverride !== null ? (window as any).manualTimeOverride : currentHour });

  useEffect(() => {
    const handlePhaseInfo = (e: CustomEvent) => {
      if (isDraggingRef.current) {
         // Ignore the incoming hours if we are currently dragging to avoid jitter
         setTimeState(prev => ({ ...prev, name: e.detail.name }));
      } else {
         setTimeState({ name: e.detail.name, hours: e.detail.hours });
      }
    };
    window.addEventListener('timePhaseInfo', handlePhaseInfo as EventListener);

    window.dispatchEvent(new CustomEvent('manualTimeChange', { detail: timeState.hours }));


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
    if (angle < 0) {
      angle += 2 * Math.PI;
    }

    let hours = ((angle / (2 * Math.PI)) * 24 + 12) % 24;
    
    // Update local state instantly for smooth 60fps UX before context catches up
    setTimeState(prev => ({ ...prev, hours }));
    
    // Persist globally so re-mounts preserve the override
    (window as any).manualTimeOverride = hours;

    window.dispatchEvent(new CustomEvent('manualTimeChange', { detail: hours }));
  };

  const onMouseMove = (e: MouseEvent) => {
    if (isDragging) handleDrag(e.clientX, e.clientY);
  };

  const onTouchMove = (e: TouchEvent) => {
    if (isDragging && e.touches.length > 0) {
      e.preventDefault(); // Stop mobile page scrolling while dragging dialer
      handleDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  useEffect(() => {
    const onMouseUp = () => setDragging(false);
    const onTouchEnd = () => setDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchmove', onTouchMove, { passive: false });
      document.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging]);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    handleDrag(e.clientX, e.clientY);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setDragging(true);
    handleDrag(e.touches[0].clientX, e.touches[0].clientY);
  };

  const degrees = ((timeState.hours + 12) % 24) / 24 * 360;

  let hrs = Math.floor(timeState.hours);
  let mins = Math.round((timeState.hours - hrs) * 60);
  if (mins === 60) {
    hrs += 1;
    mins = 0;
  }
  if (hrs >= 24) hrs = 0;
  
  const displayHrs = hrs === 0 ? 12 : (hrs > 12 ? hrs - 12 : hrs);
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
            relative z-10 mt-6 px-4 py-1.5 rounded-lg text-xs font-medium text-white
            bg-black/30 hover:bg-black/40 backdrop-blur-md border border-white/20
            shadow-lg
            transition-all duration-200 touch-manipulation
          `}
        >
          ✕ Close
      </button>
    </div>
  );
};
