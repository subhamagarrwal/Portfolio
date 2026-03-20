import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { ProjectCard } from './ProjectCard';

export interface ProjectDataType {
  id: string;
  title: string;
  heading?: string;
  description: string;
  image: string;
  techStack: string[];
  github?: string;
  demo?: string;
  featured?: boolean;
  features?: string[];
}

interface MobileProjectCarouselProps {
  projects: ProjectDataType[];
  isLightMode: boolean;
  textClass: string;
}

export const MobileProjectCarousel = ({ projects, isLightMode, textClass }: MobileProjectCarouselProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const numCards = projects.length;

  // Each card transitions over 100vh of scroll depth, so it feels natural and un-rushed
  const scrollDistance = React.useMemo(() => (numCards - 1) * 100, [numCards]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Start exactly when the top of the container hits the top edge of screen
    // End when bottom of container hits bottom of screen
    offset: ['start start', 'end end']
  });

  return (
    <div
      ref={containerRef}
      className="block md:hidden relative w-[100vw] left-1/2 -translate-x-1/2 pt-8"
      style={{ height: `calc(100vh + ${scrollDistance}vh)` }}
    >
      {/* 
        This is the sticky wrapper. By making it exactly 100vh (h-screen)
        and sticky top-0, the browser visibly STOPs scrolling down the page.
        Instead, it "sticks" to the screen exactly, and the scrollbar just 
        moves down the invisible height we added above.
      */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center pointer-events-none">
        
        {/* We place the title inside the sticky section so it stays fixed too, just like the user requested! */}
        <h2 className={`text-4xl font-bold text-center mb-2 pointer-events-auto transition-colors duration-300 ${!isLightMode ? '' : ''} ${textClass}`}>
          Featured Projects
        </h2>

        <div className="relative w-[85vw] max-w-[800px] h-[420px] pointer-events-auto mt-16 pb-8">
          {projects.map((project, i) => (
            <MobileCard
              key={project.id}
              project={project}
              index={i}
              total={numCards}
              progress={scrollYProgress}
              isLightMode={isLightMode}
              textClass={textClass}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

interface MobileCardProps {
  project: ProjectDataType;
  index: number;
  total: number;
  progress: MotionValue<number>;
  isLightMode: boolean;
  textClass: string;
}

const MobileCard = ({ project, index, total, progress, isLightMode, textClass }: MobileCardProps) => {
  const expandedProgress = useTransform(progress, (p) => p * (total - 1));
  const relativeProgress = useTransform(expandedProgress, (p) => index - p);

  // useMemo / useCallback is perfect here to stop garbage collection thrashing 
  // on every single scroll frame tick in mobile!
  const calculateY = React.useCallback((rp: number) => {
    if (rp > 0) {
      // Card is BELOW the active card.
      const PEEK_POSITION = 390;
      const STACK_SPACING = 20;
      return PEEK_POSITION * Math.min(rp, 1) + STACK_SPACING * Math.max(0, rp - 1);
    } else {
      // Card is PASSED.
      const boundedProgress = Math.max(rp, -3);
      const pushUpFactor = 20;
      return boundedProgress * pushUpFactor;
    }
  }, []);

  const translateY = useTransform(relativeProgress, calculateY);

  const scale = useTransform(relativeProgress, (rp) => {
    if (rp > 0) {
      return 1 - Math.max(0, rp - 1) * 0.02;
    } else {
      const boundedProgress = Math.max(rp, -3);
      const shrinkFactor = 0.05;
      return 1 + (boundedProgress * shrinkFactor);
    }
  });

  const opacity = useTransform(relativeProgress, (rp) => {
    // Keep fully visible for the active card.
    // Gently fade out deeply passed ones to avoid massive stacking calculations
    if (rp >= -0.5) return 1;
    return Math.max(0, 1 + (rp + 0.5) * 2); // fades to 0 as it hits -1.0
  });

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        margin: '0 auto',
        transformOrigin: 'top center',
        y: translateY,
        scale,
        opacity,
        zIndex: index, // ensures active card sits exactly ON TOP of passed card
        willChange: 'transform, opacity',
        transform: 'translateZ(0)',
      }}
      className="w-full h-[420px] shadow-2xl rounded-2xl"
    >
      <ProjectCard
         project={project}
         index={index}
         totalProjects={total}
         isLightMode={isLightMode}
         textClass={textClass}
         className="h-[420px] w-full flex flex-col"
      />
    </motion.div>
  );
};
