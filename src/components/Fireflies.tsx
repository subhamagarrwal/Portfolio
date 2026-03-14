import React, { useState, useEffect, useRef } from 'react';

interface FirefliesProps {
  count?: number;
}

export const Fireflies: React.FC<FirefliesProps> = ({ count = 20 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isMobile, setIsMobile] = useState(false);

  const [fireflies] = useState(() => 
    Array.from({ length: count }).map(() => ({
      x: Math.random() * 90 + 5, // percentage for width
      y: Math.random() * 80 + 15, // pixels for bottom
      animDuration: 3 + Math.random() * 4,
      pulseDuration: 1.5 + Math.random() * 2,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.4 + 0.6,
      id: Math.random().toString(36).substring(7)
    }))
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });
    };

    const handleMouseLeave = () => {
      setMousePos({ x: -1000, y: -1000 }); // reset
    };

    const currentRef = containerRef.current;
    if (currentRef) {
      currentRef.addEventListener('mousemove', handleMouseMove);
      currentRef.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        currentRef.removeEventListener('mousemove', handleMouseMove);
        currentRef.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [isMobile]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-20" style={{ pointerEvents: 'auto' }}>
      {fireflies.map((ff) => {
        let translateX = 0;
        let translateY = 0;

        if (!isMobile && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          // ff.x is 5-95% of container width
          const ffX = (ff.x / 100) * rect.width;
          const ffY = rect.height - ff.y; // ff.y is bottom in px

          const dx = mousePos.x - ffX;
          const dy = mousePos.y - ffY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          const repulseRadius = 60; // Distance of repulsion

          if (dist < repulseRadius && dist > 0) {
            // Repulse
            const force = (repulseRadius - dist) / repulseRadius;
            const angle = Math.atan2(dy, dx);
            translateX = -Math.cos(angle) * force * 50; 
            translateY = -Math.sin(angle) * force * 50;
          }
        }

        return (
          <div
            key={ff.id}
            className="absolute transition-transform ease-out"
            style={{
              transitionDuration: '400ms',
              left: `${ff.x}%`,
              bottom: `${ff.y}px`,
              width: '4px',
              height: '4px',
              backgroundColor: '#ADFF2F',
              borderRadius: '50%',
              boxShadow: '0 0 12px #ADFF2F, 0 0 20px #90EE90, 0 0 30px rgba(173, 255, 47, 0.3)',
              animation: `glowwormFloat ${ff.animDuration}s ease-in-out infinite, glowwormPulse ${ff.pulseDuration}s ease-in-out infinite`,
              animationDelay: `${ff.delay}s`,
              opacity: ff.opacity,
              filter: 'blur(0.5px)',
              transform: `translate(${translateX}px, ${translateY}px)`,
            }}
          />
        );
      })}
    </div>
  );
};

export default Fireflies;