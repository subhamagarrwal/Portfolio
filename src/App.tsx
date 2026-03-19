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
    // Disable smooth scrolling on mobile/touch devices for native performance
    const isMobile = window.innerWidth < 1024 || 'ontouchstart' in window;

    if (isMobile) return;

    // Making Lenis snappier like standard Next.js / Vercel sites
    const lenis = new Lenis({
      lerp: 0.15, // controls the friction/snappiness (higher = more snappy)
      smoothWheel: true,
      wheelMultiplier: 1.1,
    });

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className={timeBasedClass}>
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
