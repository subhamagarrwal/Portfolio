import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { TimeThemeProvider, useTimeTheme } from "@/contexts/TimeThemeContext";
import MountainLandscape from "@/components/MountainLandscape";
import { CometEffect } from "@/components/CometEffect";
import Lenis from "lenis";

const queryClient = new QueryClient();

const AppLayout = () => {
  const { getTimeBasedClass } = useTimeTheme();
  const timeBasedClass = getTimeBasedClass();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Handle scroll position restoration
    const savedScrollPos = sessionStorage.getItem('portfolio-scroll-pos');
    if (savedScrollPos) {
      window.scrollTo({ top: parseInt(savedScrollPos, 10), behavior: 'instant' });
      sessionStorage.removeItem('portfolio-scroll-pos'); // clear after restoring
    }

    const handleBeforeUnload = () => {
      sessionStorage.setItem('portfolio-scroll-pos', window.scrollY.toString());
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Disable smooth scrolling on mobile/touch devices for native performance
    const isMobile = window.innerWidth < 1024 || 'ontouchstart' in window;

    let lenis: Lenis | null = null;
    let rafId: number;

    if (!isMobile) {
      // Making Lenis snappier like standard Next.js / Vercel sites
      lenis = new Lenis({
        lerp: 0.15, // controls the friction/snappiness (higher = more snappy)
        smoothWheel: true,
        wheelMultiplier: 1.1,
      });

      function raf(time: number) {
        if (lenis) lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
    };
  }, []);

  return (
    <div className={timeBasedClass} suppressHydrationWarning>
      {/* Time-based Mountain Landscape Background */}
      <MountainLandscape />

      {/* Comet Effect for late night hours and dark mode */}
      <CometEffect />

      <Toaster />
      <Sonner />
      <Outlet />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TimeThemeProvider>
      <TooltipProvider>
        <AppLayout />
      </TooltipProvider>
    </TimeThemeProvider>
  </QueryClientProvider>
);

export default App;
