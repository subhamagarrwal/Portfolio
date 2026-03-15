import { useState, useRef, useEffect, RefObject } from 'react';

export const useTimeDialDrag = (
  dialRef: RefObject<HTMLDivElement>,
  currentHour: number,
  onPhaseInfo?: (e: CustomEvent) => void
) => {
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  
  const setDragging = (val: boolean) => {
    isDraggingRef.current = val;
    setIsDragging(val);
  };

  const initialTime = (window as any).manualTimeOverride !== undefined && (window as any).manualTimeOverride !== null 
    ? (window as any).manualTimeOverride 
    : currentHour;

  const [timeState, setTimeState] = useState({ name: 'Syncing...', hours: initialTime });

  useEffect(() => {
    const handlePhaseInfo = (e: CustomEvent) => {
      if (isDraggingRef.current) {
         setTimeState(prev => ({ ...prev, name: e.detail.name }));
      } else {
         setTimeState({ name: e.detail.name, hours: e.detail.hours });
      }
      if (onPhaseInfo) onPhaseInfo(e);
    };
    window.addEventListener('timePhaseInfo', handlePhaseInfo as EventListener);

    if (!isDraggingRef.current) {
      window.dispatchEvent(new CustomEvent('manualTimeChange', { detail: timeState.hours }));
    }

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
    
    setTimeState(prev => ({ ...prev, hours }));
    
    (window as any).manualTimeOverride = hours;
    window.dispatchEvent(new CustomEvent('manualTimeChange', { detail: hours }));
  };

  const onMouseMove = (e: MouseEvent) => {
    if (isDraggingRef.current) handleDrag(e.clientX, e.clientY);
  };

  const onTouchMove = (e: TouchEvent) => {
    if (isDraggingRef.current && e.touches.length > 0) {
      e.preventDefault(); 
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

  return { timeState, onMouseDown, onTouchStart };
};
