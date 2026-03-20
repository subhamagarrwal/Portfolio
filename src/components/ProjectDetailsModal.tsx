import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { ExternalLink, Github, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { palettes } from '@/constants/palettes';

interface ProjectDetailsModalProps {
  project: {
    id: string;
    title: string;
    heading: string;
    description: string;
    features?: string[];
    image: string;
    techStack: string[];
    github?: string;
    demo?: string;
    featured?: boolean;
  };
  children: React.ReactNode;
  isLightMode: boolean;
  textClass: string;
}

export function ProjectDetailsModal({ project, children, isLightMode, textClass }: ProjectDetailsModalProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const { effectiveTheme } = useTimeTheme();

  const primaryColor = React.useMemo(() => {
    switch (effectiveTheme) {
      case 'dawn':
      case 'preDawn': return '#a78bfa';
      case 'sunrise': return palettes.sunrise.bottom;
      case 'morning':
      case 'bright_day':
      case 'day': return '#1d4ed8';
      case 'noon':
      case 'warm_day': return palettes.noon.top;
      case 'afternoon': return palettes.afternoon.top;
      case 'sunset': return palettes.sunset.bottom;
      case 'dusk':
      case 'twilight': return palettes.dusk.bottom;
      case 'night':
      default: return '#ffffff';
    }
  }, [effectiveTheme]);

  useEffect(() => {
    if (!isMobile && open) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      
      // Calculate scrollbar width to prevent layout shift jumping when hiding overflow
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [open, isMobile]);

  const glassClass = isLightMode
    ? 'bg-white/40 border border-white/60 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)]'
    : 'bg-black/40 border border-white/20 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)]';

  const Content = (
    <div 
      className="flex flex-col md:flex-row w-full max-h-[85vh] md:max-h-[80vh] md:min-h-[50vh] overflow-hidden relative"
      style={{ 
        '--theme-color': primaryColor,
        '--btn-text-color': primaryColor === '#ffffff' ? '#000000' : '#ffffff'
      } as React.CSSProperties}
    >
      {!isMobile && (
        <button 
          onClick={() => setOpen(false)}
          className={`absolute right-4 top-4 z-50 rounded-full p-2 transition-colors hover:bg-black/20 ${textClass}`}
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Image Section */}
      <div className={`w-full md:w-1/2 h-[30vh] md:h-auto min-h-[30vh] relative overflow-hidden flex-shrink-0 flex items-center justify-center ${isLightMode ? 'bg-black/5' : 'bg-black/40 shadow-inner'}`}>
        <motion.img
          src={project.image}
          alt={project.title}
          className="w-full h-full md:absolute md:inset-0 object-contain md:p-4 object-center"
        />
      </div>

      {/* Content Section */}
      <div 
        className="w-full md:w-1/2 p-5 md:p-6 flex-1 min-h-0 flex flex-col overscroll-none overflow-y-auto relative hidden-scrollbar text-sm" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col">
          {/* Title */}
          <div className={`text-2xl md:text-3xl font-bold mb-1 transition-colors duration-300 ${textClass}`}>
            {project.title}
          </div>
          <div className={`text-xs md:text-sm font-medium opacity-80 mb-5 flex flex-wrap transition-colors duration-300 ${textClass}`}>
            <span className="text-[var(--theme-color)]">{project.heading}</span>
          </div>

          <div className="space-y-5 mt-2">
            <div>
              <h4 className={`text-xs font-bold tracking-widest uppercase mb-2 opacity-70 ${textClass}`}>Description</h4>
              <p className={`text-sm md:text-sm leading-relaxed ${textClass} opacity-90`}>
                {project.description}
              </p>
            </div>

            {project.features && project.features.length > 0 && (
              <div>
                <h4 className={`text-xs font-bold tracking-widest uppercase mb-2 opacity-70 ${textClass}`}>Features</h4>
                <ul className={`list-disc pl-5 space-y-1 text-sm md:text-sm ${textClass} opacity-90`}>
                  {project.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {project.techStack && (
              <div>
                <h4 className={`text-xs font-bold tracking-widest uppercase mb-3 opacity-70 ${textClass}`}>Technologies</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors duration-300 border-[var(--theme-color)] text-[var(--theme-color)] hover:bg-[var(--theme-color)] hover:text-[var(--btn-text-color)]`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-6 mb-2">
            {project.github && (
              <Button asChild variant="ghost" className={`flex-1 transition-all duration-300 border-2 border-[var(--theme-color)] text-[var(--theme-color)] hover:bg-[var(--theme-color)] hover:text-[var(--btn-text-color)] ${!isLightMode ? 'hover:shadow-[0_0_15px_var(--theme-color)] backdrop-blur-sm' : ''}`}>
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" /> Source Code
                </a>
              </Button>
            )}
            {project.demo && project.featured !== false && (
              <Button asChild variant="ghost" className={`flex-1 transition-all duration-300 bg-[var(--theme-color)] hover:bg-[var(--theme-color)] hover:opacity-90 text-[var(--btn-text-color)] border-2 border-[var(--theme-color)] ${!isLightMode ? 'shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_var(--theme-color)]' : ''}`}>
                <a href={project.demo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" /> Live Demo
                </a>
              </Button>
            )}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          {children}
        </DrawerTrigger>
        <DrawerContent className={`border-t-[1px] p-0 overflow-hidden flex flex-col ${glassClass}`}>
          <DrawerTitle className="sr-only">{project.title}</DrawerTitle>
          <DrawerDescription className="sr-only">{project.description}</DrawerDescription>
          {Content}
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop simple Framer Motion Dialog
  return (
    <>
      <div onClick={() => setOpen(true)} className="inline-block">
        {children}
      </div>
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {open && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 pointer-events-auto"
            >
              {/* Backdrop */}
              <div
                className={`absolute inset-0 backdrop-blur-sm ${isLightMode ? 'bg-white/20' : 'bg-black/60'}`}
                onClick={() => setOpen(false)}
              />

              {/* Modal Box */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                className={`relative z-10 max-w-5xl w-full border-[1px] overflow-hidden !rounded-3xl shadow-2xl ${glassClass}`}
                onClick={(e) => e.stopPropagation()}
              >
                {Content}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
