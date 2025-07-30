import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TimeThemeProvider } from "@/contexts/TimeThemeContext";
import MountainLandscape from "@/components/MountainLandscape";
import { CometEffect } from "@/components/CometEffect";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TimeThemeProvider>
      <TooltipProvider>
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
      </TooltipProvider>
    </TimeThemeProvider>
  </QueryClientProvider>
);

export default App;
