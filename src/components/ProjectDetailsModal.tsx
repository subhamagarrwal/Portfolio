import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { ExternalLink, Github, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

interface ProjectDetailsModalProps {
  project: {
    id: string;
    title: string;
    description: string;
    features?: string[];
    image: string;
    techStack: string[];
    github?: string;
    demo?: string;
  };
  children: React.ReactNode;
  isLightMode: boolean;
  textClass: string;
}

export function ProjectDetailsModal({ project, children, isLightMode, textClass }: ProjectDetailsModalProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) {
      if (open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    return () => {
      if (!isMobile) document.body.style.overflow = '';
    };
  }, [open, isMobile]);

  const glassClass = isLightMode
    ? 'bg-white/70 border-white/50 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)]'
    : 'bg-black/75 border-white/10 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)]';

  const Content = (
    <div className="flex flex-col md:flex-row h-full w-full max-h-[85vh] md:h-[70vh] overflow-hidden relative">
      {!isMobile && (
        <button 
          onClick={() => setOpen(false)}
          className={`absolute right-4 top-4 z-50 rounded-full p-2 transition-colors hover:bg-black/20 ${textClass}`}
        >
          <X className="w-6 h-6" />
        </button>
      )}

      {/* Image Section */}
      <div className="w-full md:w-1/2 h-[30vh] md:h-full relative overflow-hidden bg-black/10 flex-shrink-0">
        <motion.img
          layoutId={`project-image-${project.id}`}
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover object-top"
          loading="lazy"
        />
        {/* Adds a slight gradient overlay to blend with the background better if needed */}
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-black/50 md:from-black/20 to-transparent pointer-events-none" />
      </div>

      {/* Content Section */}
      <div className="w-full md:w-1/2 p-6 pb-24 md:p-10 flex flex-col overscroll-contain overflow-y-auto relative hidden-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="flex-grow">
          {/* Title */}
          <div className={`text-4xl font-bold mb-1 transition-colors duration-300 ${textClass}`}>
            {project.title}
          </div>
          <div className={`text-sm md:text-base font-medium opacity-80 mb-6 flex flex-wrap gap-2 transition-colors duration-300 ${textClass}`}>
            <span className="text-[var(--theme-color)]">{project.techStack?.[0]}</span>
            {project.techStack?.length > 1 && (
               <span className="opacity-70">&bull; {project.techStack?.slice(1, 3).join(' • ')}</span>
            )}
          </div>

          <div className="space-y-8 mt-8">
            <div>
              <h4 className={`text-sm font-bold tracking-widest uppercase mb-3 opacity-70 ${textClass}`}>Description</h4>
              <p className={`text-base md:text-lg leading-relaxed ${textClass} opacity-90`}>
                {project.description}
              </p>
            </div>

            {project.features && project.features.length > 0 && (
              <div>
                <h4 className={`text-sm font-bold tracking-widest uppercase mb-3 opacity-70 ${textClass}`}>Features</h4>
                <ul className={`list-disc pl-5 space-y-2 text-base md:text-lg ${textClass} opacity-90`}>
                  {project.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {project.techStack && (
              <div>
                <h4 className={`text-sm font-bold tracking-widest uppercase mb-3 opacity-70 ${textClass}`}>Technologies</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors duration-300 xl:bg-white/10 ${isLightMode ? 'bg-white/50 border-black/10 text-black' : 'bg-white/10 border-white/10 text-white'}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Actions at bottom of scroll */}
        <div className="pt-8 mt-auto flex flex-wrap gap-4">
            {project.github && (
              <Button asChild variant="outline" className={`flex-1 transition-all duration-300 bg-transparent border-2 border-[var(--theme-color)] text-[var(--theme-color)] hover:bg-[var(--theme-color)] hover:text-[var(--btn-text-color)] ${!isLightMode ? 'hover:shadow-[0_0_15px_var(--theme-color)]' : ''}`}>
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" /> Source Code
                </a>
              </Button>
            )}
            {project.demo && (
              <Button asChild className={`flex-1 transition-all duration-300 bg-[var(--theme-color)] hover:opacity-80 text-[var(--btn-text-color)] border-2 border-[var(--theme-color)] ${!isLightMode ? 'shadow-[0_0_10px_var(--theme-color)]' : ''}`}>
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
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
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
