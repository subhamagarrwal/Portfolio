import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { ProjectCard } from './ProjectCard';

interface MobileProjectCarouselProps {
  projects: any[];
  isLightMode: boolean;
  textClass: string;
}

export const MobileProjectCarousel = ({ projects, isLightMode, textClass }: MobileProjectCarouselProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const numCards = projects.length;

  // Each card transitions over 100vh of scroll depth, so it feels natural and un-rushed
  const scrollDistance = (numCards - 1) * 100;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Start exactly when the top of the container hits the top edge of screen
    // End when bottom of container hits bottom of screen
    offset: ['start start', 'end end']
  });

  return (
    <div
      ref={containerRef}
      className="block lg:hidden relative w-full pt-8"
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
        <h2 className={`text-4xl font-bold text-center mb-8 pointer-events-auto transition-colors duration-300 ${!isLightMode ? '' : ''} ${textClass}`}>
          Featured Projects
        </h2>

        <div className="relative w-full max-w-[90%] md:max-w-[400px] h-[520px] pointer-events-auto">
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
  project: any;
  index: number;
  total: number;
  progress: MotionValue<number>;
  isLightMode: boolean;
  textClass: string;
}

const MobileCard = ({ project, index, total, progress, isLightMode, textClass }: MobileCardProps) => {
  const expandedProgress = useTransform(progress, (p) => p * (total - 1));
  const relativeProgress = useTransform(expandedProgress, (p) => index - p);

  const translateY = useTransform(relativeProgress, (rp) => {
    if (rp > 0) {
      // Card is BELOW the active card.
      // We set height to 520px. Peeking at 460px leaves exactly 60px of spacing for tag visibility!
      const PEEK_POSITION = 460;
      const STACK_SPACING = 20;
      return PEEK_POSITION * Math.min(rp, 1) + STACK_SPACING * Math.max(0, rp - 1);
    } else {
      // Card is PASSED.
      const boundedProgress = Math.max(rp, -3);
      // Push up by 60px per unit to guarantee the stacks at the top are clearly visible
      const pushUpFactor = 60;
      return boundedProgress * pushUpFactor;
    }
  });

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
    if (rp > 0) {
      return 1;
    } else {
      const boundedProgress = Math.max(rp, -3);
      return Math.max(1 + (boundedProgress * 0.4), 0);
    }
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
      }}
      className="w-full h-[520px] shadow-2xl rounded-2xl"
    >
      <ProjectCard
         project={project}
         index={index}
         totalProjects={total}
         isLightMode={isLightMode}
         textClass={textClass}
         className="h-[520px] w-full flex flex-col"
      />
    </motion.div>
  );
};