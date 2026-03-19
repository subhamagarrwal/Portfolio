import React, { useRef } from 'react';
import './DynamicBackground.css';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { useSunPhase } from '@/hooks/useSunPhase';
import { useTimeDialDrag } from '@/hooks/useTimeDialDrag';

interface TimeDialProps {
  onClose: () => void;
  isDarkModeOverride: boolean;
}

export const TimeDial: React.FC<TimeDialProps> = ({ onClose, isDarkModeOverride }) => {
  const { currentHour } = useTimeTheme();
  const { keyframes } = useSunPhase(currentHour, null, null);
  const dialRef = useRef<HTMLDivElement>(null);
  
  const { timeState, onPointerDown } = useTimeDialDrag(dialRef, currentHour);

  const degrees = ((timeState.hours + 12) % 24) / 24 * 360;

  let phaseName = 'Syncing...';
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (timeState.hours >= keyframes[i].time && timeState.hours <= keyframes[i+1].time) {
      phaseName = keyframes[i].name;
      break;
    }
  }

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
           style={{ touchAction: 'none' }}
           onPointerDown={onPointerDown}>
        <div className="time-dial-ring">
            <div className="time-dial-knob-wrapper" style={{ transform: `rotate(${degrees}deg)` }}>
                <div className="time-dial-knob"></div>
            </div>
        </div>
        <div className="time-clock-display">
            <div className="time-clock-time">{`${displayHrs}:${displayMins} ${ampm}`}</div>
            <div className="time-clock-period">{phaseName}</div>
        </div>
      </div>
      <button
          onClick={onClose}
          className={`
            relative z-10 mt-6 px-4 py-1.5 rounded-lg text-xs font-medium text-white
            bg-black/30 hover:bg-black/75  border border-white/20
            shadow-lg
            transition-all duration-200 touch-manipulation
          `}
        >
          ✕ Close
      </button>
    </div>
  );
};

