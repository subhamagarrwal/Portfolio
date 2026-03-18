import { useState, useRef, useEffect, RefObject } from 'react';

export const useTimeDialDrag = (
  dialRef: RefObject<HTMLDivElement>,
  currentHour: number
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

  const [timeState, setTimeState] = useState({ hours: initialTime });

  useEffect(() => {
    if (!isDraggingRef.current) {
        setTimeState({ hours: currentHour });
    }
  }, [currentHour]);

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    e.target.setPointerCapture(e.pointerId);
    handleDrag(e.clientX, e.clientY);
  };

  const handleDrag = (clientX: number, clientY: number) => {
    if (!dialRef.current) return;
    
    const rect = dialRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    
    const angle = Math.atan2(clientY - cy, clientX - cx);
    let hours = ((angle / (2 * Math.PI)) * 24 + 12) % 24;
    
    setTimeState({ hours });
    
    (window as any).manualTimeOverride = hours;
    window.dispatchEvent(new CustomEvent('manualTimeChange', { detail: hours }));
  };

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (isDraggingRef.current) handleDrag(e.clientX, e.clientY);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (isDraggingRef.current) {
        setDragging(false);
        if (e.target instanceof Element) {
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
