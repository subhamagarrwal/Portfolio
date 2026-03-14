import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TimeThemeProvider, useTimeTheme } from "@/contexts/TimeThemeContext";
import MountainLandscape from "@/components/MountainLandscape";
import { CometEffect } from "@/components/CometEffect";
import Lenis from "lenis";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { getTimeBasedClass } = useTimeTheme();
  const timeBasedClass = getTimeBasedClass();
  
  useEffect(() => {
    // Making Lenis snappier like standard Next.js / Vercel sites
    const lenis = new Lenis({
      lerp: 0.15, // controls the friction/snappiness (higher = more snappy)
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 2,
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TimeThemeProvider>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </TimeThemeProvider>
  </QueryClientProvider>
);

export default App;
