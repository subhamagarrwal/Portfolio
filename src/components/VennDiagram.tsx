import React, { useState, useEffect } from 'react';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import VENN_JSON from '@/data/venn.json';

const Pill = ({ label, x, y, color, visible, delay }: any) => (
  <div
    className={`absolute px-[2cqw] py-[0.5cqw] font-[600] rounded-md shadow-sm backdrop-blur-sm z-10 ${color}`}
    style={{
      left: `${x}%`,
      top: `${y}%`,
      fontSize: 'clamp(0.45rem, 2cqw, 0.75rem)',
      transform: 'translate(-50%, -50%)',
      opacity: visible ? 1 : 0,
      transition: `all 0.5s cubic-bezier(.22,1,.36,1) ${delay}ms`
    }}
  >
    {label}
  </div>
);

export const VennDiagram = () => {
  const [visible, setVisible] = useState(false);
  const { isDayOrAfternoon } = useTimeTheme();
  const isLightMode = isDayOrAfternoon();

  // We can add a subtle effect or adjust based on light mode
  const lightModeOverlay = isLightMode ? "" : "dark";

  useEffect(() => {
    // Add intersection observer logic or just mount logic
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`relative w-full aspect-square mx-auto mt-8 lg:mt-0 ${lightModeOverlay}`}
      style={{ containerType: 'inline-size' }}
    >
      
      {/* USER CIRCLE */}
      <div className={`absolute left-[0%] top-[3%] w-[56%] aspect-square rounded-full border border-solid ${VENN_JSON.user.circle} transition-all duration-1000`} />
      
      {/* TECHNOLOGY CIRCLE */}
      <div className={`absolute right-[0%] top-[3%] w-[56%] aspect-square rounded-full border border-solid ${VENN_JSON.technology.circle} transition-all duration-1000`} />
      
      {/* BUSINESS CIRCLE */}
      <div className={`absolute left-[50%] top-[42%] -translate-x-1/2 w-[56%] aspect-square rounded-full border border-solid ${VENN_JSON.business.circle} transition-all duration-1000`} />

      {/* TITLES - Positioned centrally inside their non-overlapping zones */}
      <div className={`absolute z-0 ${VENN_JSON.user.titleClass} -translate-x-1/2 -translate-y-1/2 font-[700] tracking-tight whitespace-nowrap`}
           style={{ left: `${VENN_JSON.user.titleX}%`, top: `${VENN_JSON.user.titleY}%`, fontSize: 'clamp(0.9rem, 4cqw, 1.8rem)' }}>
        {VENN_JSON.user.title}
      </div>
      <div className={`absolute z-0 ${VENN_JSON.technology.titleClass} -translate-x-1/2 -translate-y-1/2 font-[700] tracking-tight whitespace-nowrap`}
           style={{ left: `${VENN_JSON.technology.titleX}%`, top: `${VENN_JSON.technology.titleY}%`, fontSize: 'clamp(0.9rem, 4cqw, 1.8rem)' }}>
        {VENN_JSON.technology.title}
      </div>
      <div className={`absolute z-0 ${VENN_JSON.business.titleClass} -translate-x-1/2 -translate-y-1/2 font-[700] tracking-tight whitespace-nowrap`}
           style={{ left: `${VENN_JSON.business.titleX}%`, top: `${VENN_JSON.business.titleY}%`, fontSize: 'clamp(0.9rem, 4cqw, 1.8rem)' }}>
        {VENN_JSON.business.title}
      </div>

      {/* PILLS */}
      {VENN_JSON.user.items.map((item, i) => (
        <Pill key={`u-${i}`} {...item} color={VENN_JSON.user.color} visible={visible} delay={i * 70} />
      ))}
      {VENN_JSON.technology.items.map((item, i) => (
        <Pill key={`t-${i}`} {...item} color={VENN_JSON.technology.color} visible={visible} delay={i * 70 + 300} />
      ))}
      {VENN_JSON.business.items.map((item, i) => (
        <Pill key={`b-${i}`} {...item} color={VENN_JSON.business.color} visible={visible} delay={i * 70 + 600} />
      ))}

      {/* TRIPLE INTERSECTION MARKER & ARROW */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 text-foreground/80 dark:text-foreground/60 transition-opacity duration-1000" style={{ opacity: visible ? 1 : 0 }} viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
          <marker id="dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4">
            <circle cx="5" cy="5" r="4" fill="currentColor" />
          </marker>
        </defs>
        <path d="M 50,45.5 Q 68,54 86,54" fill="none" stroke="currentColor" strokeWidth="0.4" markerStart="url(#dot)" markerEnd="url(#arrow)" />
      </svg>

      <div 
        className="absolute left-[88%] top-[54%] -translate-y-1/2 z-0 font-medium italic text-foreground/80 dark:text-foreground/60 whitespace-nowrap transition-opacity duration-1000"
        style={{ opacity: visible ? 1 : 0, fontSize: 'clamp(0.6rem, 2.5cqw, 1.2rem)' }}
      >
        I work here
      </div>
    </div>
  );
};