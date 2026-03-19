import { useState, useRef, useEffect, RefObject } from 'react';

export const useTimeDialDrag = (
  dialRef: RefObject<HTMLDivElement>,
  currentHour: number
) => {
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const angleOffsetRef = useRef(0);

  const setDragging = (val: boolean) => {
    isDraggingRef.current = val;
    setIsDragging(val);
  };

  const initialTime = typeof window !== 'undefined' && (window as any).manualTimeOverride !== undefined && (window as any).manualTimeOverride !== null 
    ? (window as any).manualTimeOverride
    : currentHour;

  const [timeState, setTimeState] = useState({ hours: initialTime });
  const timeStateRef = useRef(timeState.hours);

  useEffect(() => {
    timeStateRef.current = timeState.hours;
  }, [timeState.hours]);

  useEffect(() => {
    if (!isDraggingRef.current) {
        setTimeState({ hours: currentHour });
    }
  }, [currentHour]);

  const getPointerAngle = (clientX: number, clientY: number) => {
    if (!dialRef.current) return 0;
    const rect = dialRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let angle = Math.atan2(clientY - cy, clientX - cx) + Math.PI / 2;
    if (angle < 0) angle += 2 * Math.PI;
    return angle;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    if (dialRef.current) {
      try {
        dialRef.current.setPointerCapture(e.pointerId);
      } catch (err) {}
    } else {
      try {
        (e.target as Element).setPointerCapture(e.pointerId);
      } catch (err) {}
    }

    let isKnobClick = false;
    if (e.target instanceof Element) {
      isKnobClick = e.target.classList.contains('time-dial-knob') || !!e.target.closest('.time-dial-knob-wrapper');
    }

    const clickAngle = getPointerAngle(e.clientX, e.clientY);

    if (isKnobClick) {
      // Calculate current visual angle of the knob based on current time
      let currentDialAngle = ((timeStateRef.current - 12) / 24) * 2 * Math.PI;
      // Normalize to 0 - 2PI
      currentDialAngle = ((currentDialAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      
      let diff = clickAngle - currentDialAngle;
      // Normalize diff to -PI to PI
      while (diff > Math.PI) diff -= 2 * Math.PI;
      while (diff < -Math.PI) diff += 2 * Math.PI;
      
      angleOffsetRef.current = diff;
    } else {
      angleOffsetRef.current = 0;
      handleDrag(e.clientX, e.clientY); // Snap immediately if clicking on the track
    }
  };

  const handleDrag = (clientX: number, clientY: number) => {
    if (!dialRef.current) return;

    let pointerAngle = getPointerAngle(clientX, clientY);
    let targetAngle = pointerAngle - angleOffsetRef.current;
    
    if (targetAngle < 0) targetAngle += 2 * Math.PI;

    let hours = ((targetAngle / (2 * Math.PI)) * 24 + 12) % 24;

    setTimeState({ hours });

    if (typeof window !== 'undefined') {
      (window as any).manualTimeOverride = hours;
      window.dispatchEvent(new CustomEvent('manualTimeChange', { detail: hours }));
    }
  };

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (isDraggingRef.current) handleDrag(e.clientX, e.clientY);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (isDraggingRef.current) {
        setDragging(false);
        if (dialRef.current) {
          try { dialRef.current.releasePointerCapture(e.pointerId); } catch(err) {}
        } else if (e.target instanceof Element) {
          try { e.target.releasePointerCapture(e.pointerId); } catch(err) {}
        }
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  return { timeState, onPointerDown };
};
